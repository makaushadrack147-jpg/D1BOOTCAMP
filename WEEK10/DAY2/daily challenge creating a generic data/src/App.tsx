import { useEffect, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchRecipeResults } from "./features/dataSlice";
import { DataFetcher } from "./components/DataFetcher";
import type { Recipe } from "./types/types";
import "./style.css";

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="recipe-card">
      <a
        className="recipe-image-link"
        href={recipe.sourceUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${recipe.title} recipe`}
      >
        <img className="recipe-image" src={recipe.image} alt="" loading="lazy" />
        <span className="image-arrow" aria-hidden="true">↗</span>
      </a>
      <div className="recipe-card-content">
        <p className="card-kicker">A GOOD PLACE TO START</p>
        <h2>
          <a href={recipe.sourceUrl} target="_blank" rel="noreferrer">
            {recipe.title}
          </a>
        </h2>
        <div className="recipe-meta">
          <span><span aria-hidden="true">◷</span> {recipe.readyInMinutes} min</span>
          <span><span aria-hidden="true">♧</span> {recipe.servings} servings</span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const dispatch = useAppDispatch();
  const { items, status, error, query, totalResults } = useAppSelector(
    (state) => state.data,
  );
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (status === "idle") {
      void dispatch(fetchRecipeResults(query));
    }
  }, [dispatch, query, status]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextQuery = searchInput.trim();
    if (!nextQuery || nextQuery === query) return;
    void dispatch(fetchRecipeResults(nextQuery));
  }

  function retrySearch() {
    void dispatch(fetchRecipeResults(query));
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="wordmark" href="/" aria-label="Gather home">
          <span className="wordmark-icon" aria-hidden="true">g.</span>
          gather
        </a>
        <span className="header-note">A LITTLE INSPIRATION FOR YOUR TABLE</span>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span /> THE RECIPE FINDER</p>
            <h1>Good food<br />starts <em>somewhere.</em></h1>
            <p className="hero-description">
              Find a new favorite, make it your own, and bring everyone to the
              table.
            </p>
            <form className="search-form" onSubmit={handleSearch}>
              <label className="visually-hidden" htmlFor="recipe-search">
                Search recipes by ingredient or dish
              </label>
              <span className="search-icon" aria-hidden="true">⌕</span>
              <input
                id="recipe-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Try “lemon pasta” or “chickpeas”"
                maxLength={80}
              />
              <button type="submit" disabled={!searchInput.trim() || status === "loading"}>
                Find recipes <span aria-hidden="true">↗</span>
              </button>
            </form>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-plate">
              <span className="plate-ring" />
              <span className="art-pasta pasta-one" />
              <span className="art-pasta pasta-two" />
              <span className="art-pasta pasta-three" />
              <span className="art-tomato tomato-one" />
              <span className="art-tomato tomato-two" />
              <span className="art-herb herb-one" />
              <span className="art-herb herb-two" />
            </div>
            <span className="art-note">made to be<br />shared</span>
          </div>
        </section>

        <section className="results-section" aria-labelledby="results-title">
          <div className="results-header">
            <div>
              <p className="eyebrow">A LITTLE SOMETHING FOR YOU</p>
              <h2 id="results-title">
                {status === "loading" ? "On the menu" : `Recipes for “${query}”`}
                <span className="heading-dot">.</span>
              </h2>
            </div>
            {status === "succeeded" && (
              <span className="result-count">
                {totalResults} {totalResults === 1 ? "IDEA" : "IDEAS"}
              </span>
            )}
          </div>
          <DataFetcher<Recipe>
            items={items}
            status={status}
            error={error}
            query={query}
            onRetry={retrySearch}
            renderItem={(recipe) => <RecipeCard key={recipe.id} recipe={recipe} />}
          />
        </section>
      </main>

      <footer className="site-footer">
        <span>GATHER <span aria-hidden="true">✳</span></span>
        <span>FIND YOUR NEXT LITTLE JOY</span>
      </footer>
    </div>
  );
}
