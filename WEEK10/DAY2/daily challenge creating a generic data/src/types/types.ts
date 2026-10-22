export interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
}

export interface SpoonacularRecipeResponse {
  results: Recipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

export interface DataState<T> {
  items: T[];
  status: RequestStatus;
  error: string | null;
  query: string;
  totalResults: number;
  currentRequestId: string | null;
}

export interface AppState {
  data: DataState<Recipe>;
}
