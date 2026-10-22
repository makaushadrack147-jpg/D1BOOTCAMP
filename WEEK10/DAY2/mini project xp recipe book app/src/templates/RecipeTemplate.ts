import type { RecipeItem } from "../model/RecipeItem";

export type RecipeFilter = "all" | "favorites";

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

export class RecipeTemplate {
  constructor(
    private readonly container: HTMLElement,
    private readonly countElement: HTMLElement,
  ) {}

  render(recipes: RecipeItem[], filter: RecipeFilter): void {
    const visibleRecipes =
      filter === "favorites" ? recipes.filter((recipe) => recipe.isFavorite) : recipes;

    this.container.replaceChildren();
    this.countElement.textContent = `${recipes.length} ${
      recipes.length === 1 ? "RECIPE" : "RECIPES"
    }`;

    if (visibleRecipes.length === 0) {
      const emptyState = createElement("div", "empty-state");
      const illustration = createElement("span", "empty-illustration", "✳");
      illustration.setAttribute("aria-hidden", "true");
      const title = createElement(
        "h3",
        "",
        filter === "favorites" ? "No favorites just yet" : "Your recipe book is waiting",
      );
      const message = createElement(
        "p",
        "",
        filter === "favorites"
          ? "Tap the heart on a recipe to keep it close."
          : "Add a recipe you love and it will feel right at home here.",
      );

      emptyState.append(illustration, title, message);
      this.container.append(emptyState);
      return;
    }

    for (const recipe of visibleRecipes) {
      this.container.append(this.createRecipeCard(recipe));
    }
  }

  private createRecipeCard(recipe: RecipeItem): HTMLElement {
    const card = createElement("article", "recipe-card");
    const cardTop = createElement("div", "card-topline");
    const badge = createElement("span", "recipe-badge", "FROM YOUR KITCHEN");
    const favoriteButton = createElement(
      "button",
      `favorite-button${recipe.isFavorite ? " is-favorite" : ""}`,
      recipe.isFavorite ? "♥" : "♡",
    );
    favoriteButton.type = "button";
    favoriteButton.dataset.action = "favorite";
    favoriteButton.dataset.id = recipe.id;
    favoriteButton.setAttribute(
      "aria-label",
      recipe.isFavorite ? `Remove ${recipe.title} from favorites` : `Add ${recipe.title} to favorites`,
    );
    favoriteButton.setAttribute("aria-pressed", String(recipe.isFavorite));
    cardTop.append(badge, favoriteButton);

    const title = createElement("h3", "recipe-title", recipe.title);
    const divider = createElement("div", "card-divider");
    const ingredientLabel = createElement("h4", "details-label", "WHAT YOU'LL NEED");
    const ingredientList = createElement("ul", "ingredient-list");
    for (const ingredient of recipe.ingredients) {
      ingredientList.append(createElement("li", "", ingredient));
    }

    const details = createElement("details", "instructions-details");
    const summary = createElement("summary", "", "The little how-to");
    const instructionText = createElement("p", "instruction-text", recipe.instructions);
    details.append(summary, instructionText);

    const cardFooter = createElement("div", "card-footer");
    const deleteButton = createElement("button", "delete-button", "Remove recipe");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = recipe.id;
    cardFooter.append(deleteButton);

    card.append(cardTop, title, divider, ingredientLabel, ingredientList, details, cardFooter);
    return card;
  }
}
