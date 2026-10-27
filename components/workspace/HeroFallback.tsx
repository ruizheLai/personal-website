export default function HeroFallback({ status, retry }: { status: "loading" | "error" | "unavailable"; retry?: () => void }) {
  return (
    <div className="workspace-fallback">
      {/* The existing render is the fallback, never a replacement for the interactive model. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/workspace_v2_preview.png" width="1600" height="1067" alt="A black desk with a monitor, ergonomic chair, backpack, and framed artwork." draggable={false} />
      <div className="workspace-status" role="status" aria-live="polite">
        {status === "loading" ? <><span className="loading-dot" aria-hidden="true" />Loading workspace</> : <>The 3D workspace is {status === "error" ? "temporarily unavailable" : "not supported in this browser"}. Explore using the navigation above.{retry && <button onClick={retry}>Try again</button>}</>}
      </div>
    </div>
  );
}
