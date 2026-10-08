# Snap Shot

A responsive React photo gallery with category routes, search, and pagination.

## Run locally

```sh
npm install
npm run dev
```

The gallery includes a small curated preview so it works without an API key. To
search Pexels and load up to 30 photos per page, create a `.env.local` file in
this directory and add your Pexels API key:

```text
VITE_PEXELS_API_KEY=your_pexels_api_key
```

Restart the dev server after adding the key. Vite exposes `VITE_` variables in
the browser bundle, so use this setup for local development or a public demo
key only; don't put a private production key in a client-side app.
