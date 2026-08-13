import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  faceName?: string;
}

interface State {
  hasError: boolean;
}

export class WatchFaceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WatchFace Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-slate-950 rounded-full flex flex-col items-center justify-center p-4 border-2 border-red-500/50 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
          <i className="ri-alarm-warning-line text-3xl text-red-400 mb-2" />
          <p className="text-xs font-orbitron font-bold text-red-300 uppercase tracking-widest mb-1">
            {this.props.faceName || 'CHRONO MODULE'}
          </p>
          <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-1 rounded border border-red-500/30">
            TEMPORAL RECALIBRATION REQUIRED
          </span>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 px-3 py-1 bg-red-500/20 hover:bg-red-500/40 border border-red-400/50 rounded text-[10px] font-orbitron text-white transition-all"
          >
            REBOOT MODULE
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default WatchFaceErrorBoundary;
