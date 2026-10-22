import type { Recipe, SpoonacularRecipeResponse } from "../types/types";

const SPOONACULAR_URL = "https://api.spoonacular.com/recipes/complexSearch";

function isRecipe(value: unknown): value is Recipe {
  if (typeof value !== "object" || value === null) return false;
  const recipe = value as Record<string, unknown>;
  return (
    typeof recipe.id === "number" &&
    typeof recipe.title === "string" &&
    typeof recipe.image === "string" &&
    typeof recipe.readyInMinutes === "number" &&
    typeof recipe.servings === "number" &&
    typeof recipe.sourceUrl === "string"
  );
}

function isRecipeResponse(value: unknown): value is SpoonacularRecipeResponse {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    Array.isArray(payload.results) &&
    payload.results.every(isRecipe) &&
    typeof payload.offset === "number" &&
    typeof payload.number === "number" &&
    typeof payload.totalResults === "number"
  );
}

export async function fetchRecipes(query: string, signal?: AbortSignal): Promise<Recipe[]> {
  const apiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error(
      "Add your Spoonacular API key to .env.local as VITE_SPOONACULAR_API_KEY, then restart the dev server.",
    );
  }

  const url = new URL(SPOONACULAR_URL);
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("query", query);
  url.searchParams.set("number", "12");
  url.searchParams.set("addRecipeInformation", "true");

  const response = await fetch(url, { signal });
  if (!response.ok) {
    if (response.status === 401 || response.status === 402) {
      throw new Error("Spoonacular rejected the API key or its request limit has been reached.");
    }
    throw new Error(`Recipe search failed (${response.status} ${response.statusText}).`);
  }

  const payload: unknown = await response.json();
  if (!isRecipeResponse(payload)) {
    throw new Error("Spoonacular returned recipe data in an unexpected format.");
  }
  return payload.results;
}
