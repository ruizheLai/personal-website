"use client";
import { Component, type ReactNode } from "react";
export default class PhysicsBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) { console.error("Bin physics could not be initialized. Main navigation remains available.", error); }
  render() { return this.state.failed ? null : this.props.children; }
}
