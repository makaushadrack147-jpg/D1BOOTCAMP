import { RecipeCollection } from "./model/RecipeCollection";
import { RecipeTemplate, type RecipeFilter } from "./templates/RecipeTemplate";
import "./style.css";

const form = document.querySelector<HTMLFormElement>("#recipeEntryForm");
const titleInput = document.querySelector<HTMLInputElement>("#recipeTitle");
const ingredientsInput = document.querySelector<HTMLTextAreaElement>("#ingredients");
const instructionsInput = document.querySelector<HTMLTextAreaElement>("#instructions");
const recipeContainer = document.querySelector<HTMLDivElement>("#recipeContainer");
const recipeCount = document.querySelector<HTMLElement>("#recipeCount");
const clearButton = document.querySelector<HTMLButtonElement>("#clearRecipesButton");
const appMessage = document.querySelector<HTMLElement>("#appMessage");
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter-button");

if (
  !form ||
  !titleInput ||
  !ingredientsInput ||
  !instructionsInput ||
  !recipeContainer ||
  !recipeCount ||
  !clearButton ||
  !appMessage
) {
  throw new Error("The recipe book could not start because required page elements are missing.");
}

const messageElement = appMessage;
const collection = new RecipeCollection();
const template = new RecipeTemplate(recipeContainer, recipeCount);
let activeFilter: RecipeFilter = "all";

function showMessage(message: string, isError = false): void {
  messageElement.textContent = message;
  messageElement.classList.toggle("is-error", isError);
  messageElement.classList.add("is-visible");
  window.setTimeout(() => messageElement.classList.remove("is-visible"), 3500);
}

function renderRecipes(): void {
  template.render(collection.getRecipes(), activeFilter);
}

try {
  collection.loadFromStorage();
} catch (error) {
  console.error("Unable to load saved recipes.", error);
  showMessage("Your saved recipes could not be loaded. You can still add new ones.", true);
}
renderRecipes();

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const ingredients = ingredientsInput.value
    .split(/\r?\n/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
  const instructions = instructionsInput.value.trim();

  if (!title || ingredients.length === 0 || !instructions) {
    showMessage("Add a recipe name, at least one ingredient, and the instructions.", true);
    return;
  }

  try {
    collection.addRecipe(title, ingredients, instructions);
    form.reset();
    activeFilter = "all";
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === activeFilter);
    });
    renderRecipes();
    showMessage("Your recipe has been added. Bon appétit!");
  } catch (error) {
    console.error("Unable to save the new recipe.", error);
    showMessage("This recipe could not be saved. Check your browser storage and try again.", true);
  }
});

recipeContainer.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const button = target.closest<HTMLButtonElement>("button[data-action]");
  const id = button?.dataset.id;
  const action = button?.dataset.action;
  if (!button || !id || (action !== "favorite" && action !== "delete")) return;

  try {
    if (action === "favorite") {
      collection.toggleFavorite(id);
    } else {
      collection.removeRecipe(id);
      showMessage("Recipe removed from your collection.");
    }
    renderRecipes();
  } catch (error) {
    console.error("Unable to update the recipe collection.", error);
    showMessage("That change could not be saved. Check your browser storage and try again.", true);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    if (filter !== "all" && filter !== "favorites") return;

    activeFilter = filter;
    filterButtons.forEach((filterButton) => {
      filterButton.classList.toggle("is-active", filterButton === button);
    });
    renderRecipes();
  });
});

clearButton.addEventListener("click", () => {
  if (collection.getRecipes().length === 0) {
    showMessage("Your recipe book is already empty.");
    return;
  }

  if (!window.confirm("Clear every recipe from your book? This cannot be undone.")) return;

  try {
    collection.clearRecipes();
    activeFilter = "all";
    filterButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === activeFilter);
    });
    renderRecipes();
    showMessage("Your recipe book is fresh and ready for something new.");
  } catch (error) {
    console.error("Unable to clear saved recipes.", error);
    showMessage("Your recipes could not be cleared. Check your browser storage and try again.", true);
  }
});
