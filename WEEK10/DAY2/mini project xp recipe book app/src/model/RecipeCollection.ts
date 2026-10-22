import { RecipeItem, type RecipeData } from "./RecipeItem";

const STORAGE_KEY = "good-thyme-recipes";

function isRecipeData(value: unknown): value is RecipeData {
  if (typeof value !== "object" || value === null) return false;

  const recipe = value as Record<string, unknown>;
  return (
    typeof recipe.id === "string" &&
    typeof recipe.title === "string" &&
    Array.isArray(recipe.ingredients) &&
    recipe.ingredients.every((ingredient) => typeof ingredient === "string") &&
    typeof recipe.instructions === "string" &&
    typeof recipe.isFavorite === "boolean"
  );
}

export class RecipeCollection {
  private recipes: RecipeItem[] = [];

  constructor(private readonly storage: Storage = window.localStorage) {}

  getRecipes(): RecipeItem[] {
    return [...this.recipes];
  }

  addRecipe(title: string, ingredients: string[], instructions: string): RecipeItem {
    const recipe = new RecipeItem(title, ingredients, instructions);
    this.updateRecipes([recipe, ...this.recipes]);
    return recipe;
  }

  removeRecipe(id: string): void {
    this.updateRecipes(this.recipes.filter((recipe) => recipe.id !== id));
  }

  toggleFavorite(id: string): void {
    if (!this.recipes.some((recipe) => recipe.id === id)) return;

    const recipes = this.recipes.map((recipe) => {
      const updatedRecipe = new RecipeItem(
        recipe.title,
        recipe.ingredients,
        recipe.instructions,
        recipe.id,
        recipe.isFavorite,
      );
      if (updatedRecipe.id === id) updatedRecipe.toggleFavorite();
      return updatedRecipe;
    });
    this.updateRecipes(recipes);
  }

  clearRecipes(): void {
    this.updateRecipes([]);
  }

  loadFromStorage(): void {
    const storedRecipes = this.storage.getItem(STORAGE_KEY);
    if (storedRecipes === null) return;

    const parsed: unknown = JSON.parse(storedRecipes);
    if (!Array.isArray(parsed) || !parsed.every(isRecipeData)) {
      throw new Error("Saved recipes are not in a valid format.");
    }

    this.recipes = parsed.map(
      (recipe) =>
        new RecipeItem(
          recipe.title,
          recipe.ingredients,
          recipe.instructions,
          recipe.id,
          recipe.isFavorite,
        ),
    );
  }

  saveToStorage(): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(this.recipes));
  }

  private updateRecipes(recipes: RecipeItem[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(recipes));
    this.recipes = recipes;
  }
}
