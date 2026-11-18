'use client';

import { Component, type ReactNode } from 'react';

export default class SceneBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      if (this.props.fallback) return this.props.fallback;
      return <div className="scene-error"><span>Explore another perspective.</span><p>The interactive study could not load in this browser. The collection photographs and object records are available above.</p><a href="#collection">Return to the collection</a></div>;
    }
    return this.props.children;
  }
}
