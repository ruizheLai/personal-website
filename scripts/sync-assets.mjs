import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
const root = process.cwd();
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const sourcePath = path.join(root, "workspace/models/workspace_v3.glb");
const bytes = await readFile(sourcePath);
if (bytes.toString("ascii", 0, 4) !== "glTF" || bytes.readUInt32LE(4) !== 2) throw Error("Expected a glTF 2 GLB");
if (bytes.readUInt32LE(16) !== 0x4e4f534a) throw Error("Missing GLB JSON chunk");
const gltf = JSON.parse(bytes.toString("utf8", 20, 20 + bytes.readUInt32LE(12)));
const named = new Map(gltf.nodes.map((node, index) => [node.name, { ...node, index }]));
const required = ["Workspace", "Monitor", "MonitorScreen", "WallFrame", "FrameArtwork", "Smartphone", "PhoneScreen", "PhoneStand", "Chair_Root", "Backpack_Root", "TrashBin", "WorkspaceCamera", "SeamlessWall"];
for (const name of required) if (!named.has(name)) throw Error(`Missing required node: ${name}`);
if (named.has("Wall")) throw Error("The bounded wall panel must not be present in v3");
const artworkAccessor = gltf.accessors[gltf.meshes[named.get("FrameArtwork").mesh].primitives[0].attributes.POSITION];
const artworkWidth = artworkAccessor.max[0] - artworkAccessor.min[0];
const artworkHeight = artworkAccessor.max[1] - artworkAccessor.min[1];
if (Math.abs(artworkWidth - artworkHeight) > 1e-5) throw Error("V3 artwork must remain square");
const chair = named.get("Chair_Root");
if (chair.extras?.rotation_axis_gltf !== "Y") throw Error("Chair's glTF rotation axis is not verified Y");
if (chair.rotation && chair.rotation.some((n, i) => Math.abs(n - (i === 3 ? 1 : 0)) > 1e-5)) throw Error("Unexpected chair default rotation");
if (chair.scale && chair.scale.some(n => Math.abs(n - 1) > 1e-5)) throw Error("Unexpected chair scale");
const cameraNode = named.get("WorkspaceCamera");
const camera = gltf.cameras[cameraNode.camera];
if (camera.type !== "orthographic") throw Error("Expected the exported orthographic camera");
async function sync(relative, data) {
  const dest = path.join(root, relative);
  let previous;
  try { previous = await readFile(dest); } catch (error) { if (error.code !== "ENOENT") throw error; }
  await mkdir(path.dirname(dest), { recursive: true });
  if (!previous || hash(previous) !== hash(data)) await writeFile(dest, data);
  if (hash(await readFile(dest)) !== hash(data)) throw Error(`Asset verification failed: ${relative}`);
}
await sync("public/models/workspace_v3.glb", bytes);
await sync("public/images/workspace_v3_preview.png", await readFile(path.join(root, "workspace/previews/workspace_v3_preview.png")));
const parentOf = new Map();
gltf.nodes.forEach((node, index) => node.children?.forEach(child => parentOf.set(child, gltf.nodes[index].name)));
const audit = {
  source: "workspace/models/workspace_v3.glb",
  servedCopy: "public/models/workspace_v3.glb",
  sha256: hash(bytes), bytes: bytes.length,
  nodeCount: gltf.nodes.length, meshCount: gltf.meshes.length,
  materialCount: gltf.materials.length,
  artwork: { width: artworkWidth, height: artworkHeight, aspectRatio: artworkWidth / artworkHeight },
  boundedWallPanel: false,
  chair: { name: chair.name, parent: parentOf.get(chair.index), translation: chair.translation, rotation: chair.rotation ?? [0, 0, 0, 1], axis: "Y" },
  camera: { ...cameraNode, definition: camera },
  interactions: required.map(name => ({ name, parent: parentOf.get(named.get(name).index) ?? null })),
};
if (process.argv.includes("--audit")) {
  await writeFile(path.join(root, "workspace/reports/web_model_audit.json"), JSON.stringify(audit, null, 2) + "\n");
  console.log(JSON.stringify(audit, null, 2));
} else console.log(`Web assets verified: ${gltf.nodes.length} GLB nodes, ${bytes.length} bytes; source preserved.`);
