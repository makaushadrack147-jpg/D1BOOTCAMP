import type { ReactNode } from "react";
import type { RequestStatus } from "../types/types";

interface DataFetcherProps<T> {
  items: T[];
  status: RequestStatus;
  error: string | null;
  query: string;
  renderItem: (item: T) => ReactNode;
  onRetry: () => void;
}

export function DataFetcher<T>({
  items,
  status,
  error,
  query,
  renderItem,
  onRetry,
}: DataFetcherProps<T>) {
  if (status === "loading") {
    return (
      <div className="state-panel loading-panel" role="status">
        <span className="loader" aria-hidden="true" />
        <h2>Finding something delicious</h2>
        <p>Looking for recipes with “{query}”...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="state-panel error-panel" role="alert">
        <span className="state-icon" aria-hidden="true">!</span>
        <h2>We hit a little snag</h2>
        <p>{error ?? "The recipes could not be loaded."}</p>
        <button className="retry-button" type="button" onClick={onRetry}>
          Try again
        </button>
      </div>
    );
  }

  if (status === "succeeded" && items.length === 0) {
    return (
      <div className="state-panel empty-panel">
        <span className="state-icon" aria-hidden="true">⌕</span>
        <h2>No recipes found</h2>
        <p>Try another ingredient or dish name.</p>
      </div>
    );
  }

  if (status !== "succeeded") return null;

  return <div className="recipe-grid">{items.map(renderItem)}</div>;
}
