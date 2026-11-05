# Hustle Hub backend

The Express API and PostgreSQL schema are kept here, independently of the frontend.

Run the API independently:

```powershell
npm ci
npm run dev
```

Configure `DATABASE_URL`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`. Use an email dedicated to the administrator and a private password at least 12 characters long; do not share or commit the password. On startup, the API creates an active administrator for that email if it does not already exist. If the email belongs to a non-admin account, startup stops rather than granting that account administrator access. Restart the API after changing `.env`. The API listens on port `4000` by default. Set `CORS_ORIGINS` to a comma-separated list of exact frontend origins when deploying; in non-production environments, local Vite origins on `localhost` or `127.0.0.1` ports `5173`-`5199` are allowed by default.

Password reset emails use the existing Resend integration. Configure `RESEND_API_KEY`, `EMAIL_FROM`, and `FRONTEND_URL`; reset links expire after one hour and can only be used once. In local development, `FRONTEND_URL` defaults to `http://127.0.0.1:5173`.
