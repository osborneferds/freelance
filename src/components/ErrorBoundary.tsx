import { Component, type ErrorInfo, type ReactNode } from "react";
import { site } from "../config";

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // In production you'd forward this to an error-reporting service.
    console.error("Unhandled UI error:", error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-ink text-lime">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
              <path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.9a2 2 0 0 0-3.4 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl tracking-tight">Something went wrong</h1>
          <p className="mt-2 text-muted">
            An unexpected error occurred. Reloading usually fixes it — if not, please email{" "}
            <a href={`mailto:${site.email}`} className="text-ink underline">
              {site.email}
            </a>
            .
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => location.reload()}
              className="rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-ink/85"
            >
              Reload page
            </button>
            <a
              href="#/"
              onClick={() => this.setState({ error: null })}
              className="rounded-full border border-ink/15 px-5 py-3 text-sm font-medium transition-colors hover:border-ink"
            >
              Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }
}
