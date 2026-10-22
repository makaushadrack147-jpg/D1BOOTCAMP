import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchRecipes } from "../api/api";
import type { AppState, DataState, Recipe } from "../types/types";

const initialState: DataState<Recipe> = {
  items: [],
  status: "idle",
  error: null,
  query: "pasta",
  totalResults: 0,
  currentRequestId: null,
};

export const fetchRecipeResults = createAsyncThunk<
  { items: Recipe[]; query: string },
  string,
  { state: AppState }
>(
  "data/fetchRecipeResults",
  async (query: string, { signal }) => {
    const items = await fetchRecipes(query, signal);
    return { items, query };
  },
  {
    condition: (_query, { getState }) => getState().data.status !== "loading",
  },
);

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipeResults.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
        state.query = action.meta.arg;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchRecipeResults.fulfilled, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "succeeded";
        state.items = action.payload.items;
        state.query = action.payload.query;
        state.totalResults = action.payload.items.length;
        state.currentRequestId = null;
      })
      .addCase(fetchRecipeResults.rejected, (state, action) => {
        if (state.currentRequestId !== action.meta.requestId) return;
        state.status = "failed";
        state.error =
          action.error.message ?? "An unexpected error occurred while loading recipes.";
        state.currentRequestId = null;
      });
  },
});

export default dataSlice.reducer;
