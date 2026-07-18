import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('Unhandled UI error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-slate-100 text-center dark:bg-slate-950">
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">Something went wrong</p>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Please refresh the page. If the problem persists, try again in a moment.
          </p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-2">
            Refresh
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
