# Hustle Hub frontend

The public landing page is `index.html`. The marketplace remains available at `/marketplace.html`.

Run the frontend independently:

```powershell
npm ci
npm run dev
```

In development, Vite forwards `/api` requests to the backend at `http://127.0.0.1:4000`. For a deployed frontend, set `VITE_API_URL` to the backend's public URL before building.

Customers can browse active provider listings in the marketplace and submit a service request after signing in. The request includes the service, location, preferred date, and details, and is sent to the backend's `/api/requests` endpoint.

Administrators can sign in from the marketplace to upload or replace photos for individual common services. Uploaded JPEG, PNG, and WebP images (up to 1 MB) are stored by the backend and shown to all visitors.

The common-service cards include individual, commercially reusable stock photos. Each photo displays a link to its creator/source and license; uploaded administrator photos replace the stock image for that service.
