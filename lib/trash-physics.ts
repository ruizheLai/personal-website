import type { RapierRigidBody } from "@react-three/rapier";
export const BIN_PHYSICS = {
  floorY: -.005, radius: .155, height: .403, segments: 16,
  massBottom: .18, massWall: .02, paperMass: .009,
  linearDamping: 1.4, angularDamping: 2.4,
  bounds: { left: 1.25, right: 2.35, back: -.3, front: 2.5, ceiling: 2.7 },
} as const;
export const PAPER_SPECS = [
  { radius: .033, x: -.044, z: -.042, seed: 1 },
  { radius: .037, x: .044, z: -.042, seed: 2 },
  { radius: .032, x: -.044, z: .043, seed: 3 },
  { radius: .035, x: .044, z: .043, seed: 4 },
] as const;
export function hollowBinWalls() {
  return Array.from({ length: BIN_PHYSICS.segments }, (_, index) => {
    const vertices: number[] = [];
    for (const [y, inner, outer] of [[.026, .128, .139], [.403, .143, .155]]) {
      for (const radius of [inner, outer]) for (const edge of [index, index + 1]) {
        const angle = edge * Math.PI * 2 / BIN_PHYSICS.segments;
        vertices.push(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      }
    }
    return new Float32Array(vertices);
  });
}
export function resetBody(body: RapierRigidBody, position: { x: number; y: number; z: number }, rotation = { x: 0, y: 0, z: 0, w: 1 }) {
  body.resetForces(false); body.resetTorques(false);
  body.setTranslation(position, false); body.setRotation(rotation, false);
  body.setLinvel({ x: 0, y: 0, z: 0 }, false); body.setAngvel({ x: 0, y: 0, z: 0 }, false);
  body.sleep();
}
