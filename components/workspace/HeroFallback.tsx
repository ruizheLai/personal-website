export default function HeroFallback({ status, retry }: { status: "loading" | "error" | "unavailable"; retry?: () => void }) {
  if (status === "loading") return <span className="sr-only" role="status">Loading workspace</span>;
  return <div className="workspace-fallback">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/images/workspace_v2_preview.png" width="1600" height="1067" alt="The workspace, with desk, monitor, chair and backpack." draggable={false} />
    <div className="workspace-status" role="status" aria-live="polite">The 3D workspace is {status === "error" ? "temporarily unavailable" : "not supported in this browser"}. Explore using the navigation above.{retry && <button onClick={retry}>Try again</button>}</div>
  </div>;
}
