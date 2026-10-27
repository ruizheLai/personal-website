"use client";
import type { Interaction, InteractionPhase } from "@/lib/workspace-config";
export default function InteractiveObject({ interaction, selected, phase, enabled, attach, onFocus, onBlur, onActivate }: {
  interaction: Interaction; selected: boolean; phase: InteractionPhase; enabled: boolean;
  attach: (element: HTMLDivElement | null) => void;
  onFocus: () => void; onBlur: () => void; onActivate: () => void;
}) {
  const action = selected && phase === "focused" ? "Enter" : "Focus";
  return <div ref={attach} className="projected-object-control">
    <button className="scene-focus-target" disabled={!enabled || ((phase === "focused" || phase === "focusing" || phase === "transitioning") && !selected)} aria-disabled={phase === "focusing" || phase === "transitioning"} aria-describedby="workspace-instructions" aria-label={`${action} ${interaction.label}`} aria-pressed={selected} onFocus={onFocus} onBlur={onBlur} onClick={onActivate}>
      <span className="sr-only">{action} {interaction.label}</span>
    </button>
  </div>;
}
