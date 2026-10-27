"use client";
import type { Interaction } from "@/lib/workspace-config";
export default function InteractiveObject({ interaction, active, enabled, attach, onFocus, onBlur, onNavigate }: {
  interaction: Interaction; active: boolean; enabled: boolean;
  attach: (element: HTMLDivElement | null) => void;
  onFocus: () => void; onBlur: () => void; onNavigate: () => void;
}) {
  return (
    <div ref={attach} className="projected-object-control">
      <button className="scene-focus-target" disabled={!enabled} aria-label={interaction.label} onFocus={onFocus} onBlur={onBlur} onClick={onNavigate}>
        <span className="sr-only">{interaction.label}</span>
      </button>
      {active && <span className="object-tooltip" role="tooltip">{interaction.label}</span>}
    </div>
  );
}
