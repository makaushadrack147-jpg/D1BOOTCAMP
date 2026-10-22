# Gather Recipe Finder

A React + TypeScript recipe search demo using Redux Toolkit and a generic
`DataFetcher<T>` component.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Add your Spoonacular API key to `.env.local`:

   ```text
   VITE_SPOONACULAR_API_KEY=your_api_key
   ```

4. Start Vite with `npm run dev`.

Restart the development server after changing `.env.local`. The search uses
Spoonacular's recipe complex search endpoint.

Vite exposes `VITE_` variables to browser code. This direct API integration is
for local learning only; do not use a private API key this way in a deployed
application. A production app should send requests through a server-side
endpoint that keeps the key private.

## Project map

- `src/api/api.ts` performs and validates the Spoonacular request.
- `src/features/dataSlice.ts` tracks loading, success, and error state through
  a Redux Toolkit async thunk.
- `src/components/DataFetcher.tsx` is generic over the item type and handles
  loading, error, empty, and rendered-list states.
- `src/App.tsx` connects the recipe search UI to the global Redux state.
