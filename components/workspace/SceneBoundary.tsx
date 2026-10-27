"use client";
import { Component, type ReactNode, type ErrorInfo } from "react";
export default class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Workspace could not be rendered:", error, info.componentStack);
    this.props.onError();
  }
  render() { return this.state.failed ? null : this.props.children; }
}
