"use client";

import { useRef, type ReactNode } from "react";
import { useOnceViewportProgress } from "./ViewportMotion";

const TASKS = [
  { label: "Start a maintenance report", score: 5.00 },
  { label: "Capture and submit evidence", score: 4.67 },
  { label: "Review a report and request evidence as PM", score: 3.67 },
  { label: "Respond to a follow-up request", score: 4.33 },
  { label: "Locate property-manager contact details", score: 3.83 },
] as const;

export function EvaluationMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useOnceViewportProgress(ref);
  return (
    <div className="fx-er-metrics" ref={ref} data-animation-complete={progress === 1}>
      <div className="fx-er-metric">
        <strong>
          <span className="fx-er-count" aria-hidden="true">{(91.7 * progress).toFixed(1)}</span>
          <span className="fx-er-suffix" aria-hidden="true">/100</span>
          <span className="fx-er-sr-only">91.7 out of 100</span>
        </strong>
        <p>Mean System Usability Scale</p>
      </div>
      <div className="fx-er-metric">
        <strong>
          <span className="fx-er-count" aria-hidden="true">{(4.30 * progress).toFixed(2)}</span>
          <span className="fx-er-suffix" aria-hidden="true">/5</span>
          <span className="fx-er-sr-only">4.30 out of 5</span>
        </strong>
        <p>Mean adapted task ease</p>
      </div>
      <div className="fx-er-metric">
        <strong>
          <span className="fx-er-count fx-er-count-small" aria-hidden="true">{Math.round(6 * progress)}</span>
          <span className="fx-er-suffix" aria-hidden="true">people</span>
          <span className="fx-er-sr-only">6 people</span>
        </strong>
        <p>Five tasks · Hi-fi prototype</p>
      </div>
    </div>
  );
}

export function TaskEaseChart() {
  const ref = useRef<HTMLElement>(null);
  const progress = useOnceViewportProgress(ref);
  return (
    <figure className="fx-er-chart" ref={ref} data-animation-complete={progress === 1}>
      <figcaption>
        <h3>Where the friction appeared</h3>
        <p>Mean adapted task ease · 1 very difficult → 5 very easy</p>
      </figcaption>
      <ol>
        {TASKS.map((task, index) => (
          <li key={task.label}>
            <div className="fx-er-task-label">
              <span><small>T{index + 1}</small><span>{task.label}</span></span>
              <strong>{task.score.toFixed(2)}</strong>
            </div>
            <div className="fx-er-track" aria-hidden="true">
              <span
                className={index === 2 || index === 4 ? "fx-er-bar fx-er-bar-lower" : "fx-er-bar"}
                style={{ width: (task.score / 5 * 100) + "%", transform: "scaleX(" + progress + ")" }}
              />
            </div>
          </li>
        ))}
      </ol>
    </figure>
  );
}

/** Pass the existing findings as children; keep the study-scope caveat after this component. */
export default function EvaluationResults({ children }: { children?: ReactNode }) {
  return (
    <div className="fx-evaluation-results">
      <EvaluationMetrics />
      <div className={"fx-er-grid" + (!children ? " fx-er-grid-single" : "")}>
        <TaskEaseChart />
        {children}
      </div>
    </div>
  );
}
