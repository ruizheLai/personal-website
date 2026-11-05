"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AssetFigure, type CaseStudyAsset } from "@/components/fixlens/CaseStudyExperience";

export type EvolutionTopic = {
  id: string;
  label: string;
  description: ReactNode;
  stages: Array<{ label: string; asset: CaseStudyAsset }>;
  note?: ReactNode;
};

function nextIndex(event: KeyboardEvent<HTMLButtonElement>, current: number, length: number) {
  if (!length || event.altKey || event.ctrlKey || event.metaKey) return null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") return (current + 1) % length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") return (current - 1 + length) % length;
  if (event.key === "Home") return 0;
  if (event.key === "End") return length - 1;
  return null;
}

function fidelityName(label: string) {
  return label.split(/\s[—–]\s/)[0];
}

/**
 * A presentation selector for genuine historical artifacts, not a simulated product.
 * Every topic and stage is visible in server HTML and without JavaScript.
 */
export function EvolutionStudio({ topics }: { topics: EvolutionTopic[] }) {
  const baseId = useId();
  const [enhanced, setEnhanced] = useState(false);
  const [activeTopic, setActiveTopic] = useState(0);
  const [activeStages, setActiveStages] = useState<Record<string, number>>({});
  const [showAll, setShowAll] = useState(false);
  const topicRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const stageRefs = useRef<Array<Array<HTMLButtonElement | null>>>([]);

  useEffect(() => setEnhanced(true), []);

  if (!topics.length) return null;

  const selectedTopic = Math.min(activeTopic, topics.length - 1);
  const selected = topics[selectedTopic];
  const selectedStage = Math.min(activeStages[selected.id] || 0, Math.max(0, selected.stages.length - 1));

  function selectTopic(index: number) {
    setActiveTopic(index);
  }

  function selectStage(topicId: string, index: number) {
    setActiveStages((current) => ({ ...current, [topicId]: index }));
  }

  return (
    <div className={"fx-evolution-studio" + (enhanced ? " fx-es-enhanced" : "") + (showAll ? " fx-es-all" : "")}>
      <div className="fx-es-topic-tabs" role="tablist" aria-label="Design evolution topics" hidden={!enhanced}>
        {topics.map((topic, index) => (
          <button
            className="fx-es-topic-tab"
            type="button"
            role="tab"
            key={topic.id}
            id={baseId + "-topic-tab-" + index}
            aria-selected={selectedTopic === index}
            aria-controls={baseId + "-topic-panel-" + index}
            tabIndex={selectedTopic === index ? 0 : -1}
            ref={(node) => { topicRefs.current[index] = node; }}
            onClick={() => selectTopic(index)}
            onKeyDown={(event) => {
              const next = nextIndex(event, index, topics.length);
              if (next === null) return;
              event.preventDefault();
              selectTopic(next);
              topicRefs.current[next]?.focus();
            }}
          >
            <span className="fx-es-topic-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span>{topic.label}</span>
          </button>
        ))}
      </div>

      {topics.map((topic, topicIndex) => {
        const stageIndex = Math.min(activeStages[topic.id] || 0, Math.max(0, topic.stages.length - 1));
        return (
          <section
            key={topic.id}
            className="fx-es-topic"
            id={baseId + "-topic-panel-" + topicIndex}
            role={enhanced ? "tabpanel" : undefined}
            aria-labelledby={enhanced ? baseId + "-topic-tab-" + topicIndex : baseId + "-topic-heading-" + topicIndex}
            hidden={enhanced && selectedTopic !== topicIndex}
            tabIndex={enhanced ? 0 : undefined}
          >
            <div className="fx-es-topic-heading">
              <div className="fx-es-topic-copy">
                <h3 id={baseId + "-topic-heading-" + topicIndex}>{topic.label}</h3>
                <div className="fx-es-description">{topic.description}</div>
              </div>
              <button
                className="fx-es-overview-toggle"
                type="button"
                aria-pressed={showAll}
                onClick={() => setShowAll((current) => !current)}
                hidden={!enhanced}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4" width="7" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="14" y="4" width="7" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <span>Show all stages</span>
              </button>
            </div>

            <div
              className="fx-es-stage-tabs"
              role="tablist"
              aria-label={topic.label + " fidelity stages"}
              hidden={!enhanced || showAll}
            >
              {topic.stages.map((stage, index) => (
                <button
                  className="fx-es-stage-tab"
                  type="button"
                  role="tab"
                  key={stage.label}
                  id={baseId + "-stage-tab-" + topicIndex + "-" + index}
                  aria-label={stage.label}
                  aria-selected={stageIndex === index}
                  aria-controls={baseId + "-stage-panel-" + topicIndex + "-" + index}
                  tabIndex={stageIndex === index ? 0 : -1}
                  ref={(node) => {
                    stageRefs.current[topicIndex] ??= [];
                    stageRefs.current[topicIndex][index] = node;
                  }}
                  onClick={() => selectStage(topic.id, index)}
                  onKeyDown={(event) => {
                    const next = nextIndex(event, index, topic.stages.length);
                    if (next === null) return;
                    event.preventDefault();
                    selectStage(topic.id, next);
                    stageRefs.current[topicIndex]?.[next]?.focus();
                  }}
                >
                  <span className="fx-es-step-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{fidelityName(stage.label)}</span>
                  <span className="fx-es-step-arrow" aria-hidden="true">↗</span>
                </button>
              ))}
            </div>

            <div className="fx-es-stage-panels">
              {topic.stages.map((stage, index) => {
                const isSketch = stage.label.toLowerCase().startsWith("low");
                return (
                  <div
                    className={"fx-es-stage-panel" + (isSketch ? " fx-es-sketch" : " fx-es-interface")}
                    key={stage.label}
                    id={baseId + "-stage-panel-" + topicIndex + "-" + index}
                    role={enhanced && !showAll ? "tabpanel" : undefined}
                    aria-labelledby={enhanced && !showAll ? baseId + "-stage-tab-" + topicIndex + "-" + index : baseId + "-stage-heading-" + topicIndex + "-" + index}
                    hidden={enhanced && !showAll && stageIndex !== index}
                    tabIndex={enhanced && !showAll ? 0 : undefined}
                  >
                    <div className="fx-es-stage-annotation">
                      <p className="fx-es-stage-number" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}<span>/{String(topic.stages.length).padStart(2, "0")}</span>
                      </p>
                      <div>
                        <p className="fx-es-stage-eyebrow">Design artifact</p>
                        <h4 className="fx-es-stage-label" id={baseId + "-stage-heading-" + topicIndex + "-" + index}>{stage.label}</h4>
                        <p className="fx-es-source-title">{stage.asset.title || topic.label}</p>
                      </div>
                      <span className="fx-es-stage-rule" aria-hidden="true" />
                    </div>
                    <div className={"fx-es-mount " + (isSketch ? "fx-es-paper" : "fx-es-device")}>
                      <AssetFigure
                        asset={stage.asset}
                        className="fx-es-artifact"
                        sizes="(max-width: 600px) min(300px, 80vw), 330px"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {topic.note && <div className="fx-es-note">{topic.note}</div>}
          </section>
        );
      })}

      <p className="fx-es-announcement" role="status" aria-live="polite" aria-atomic="true" hidden={!enhanced}>
        {showAll
          ? selected.label + ": showing all " + selected.stages.length + " documented stages."
          : selected.label + ": " + (selected.stages[selectedStage]?.label || "")}
      </p>
    </div>
  );
}

export default EvolutionStudio;
