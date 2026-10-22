# JWT Authentication with Express

A runnable API exercise for learning JWT authentication. It uses SQLite for users and refresh-session revocation, bcrypt for password hashing, and HTTP-only cookies for tokens.

## Setup

1. Install Node.js 20 or newer.
2. From this folder, install dependencies:

   ```sh
   npm install
   ```

3. Copy `.env.example` to `.env` and replace both token secrets with separate random values of at least 32 characters. To generate one, run:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

4. Start the API with `npm run dev`.
5. Run the automated tests with `npm test`.

The SQLite database is created at `data/auth.sqlite` when the server starts. Never commit `.env` or production secrets.

## Routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check that the API is running |
| `POST` | `/api/auth/register` | Validate and create an account; set access and refresh cookies |
| `POST` | `/api/auth/login` | Verify credentials and set new cookies |
| `POST` | `/api/auth/refresh` | Verify and rotate a refresh token |
| `POST` | `/api/auth/logout` | Revoke the refresh session and clear cookies |
| `GET` | `/api/auth/me` | Return the current authenticated user |
| `GET` | `/api/profile` | Protected profile lookup |
| `PATCH` | `/api/profile` | Protected display-name update |

Send JSON to registration and login, for example:

```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "a-long-password"
}
```

The browser stores the `HttpOnly`, `SameSite=Lax` cookies; JavaScript cannot read their token values. Access tokens expire after 15 minutes. Refresh tokens expire after 7 days, are stored only as SHA-256 hashes in SQLite, rotate on refresh, and are revoked at logout. The access cookie is scoped to `/api`; the refresh cookie is scoped to `/api/auth`. Cookies are marked `Secure` in production.

## How JWTs work

A JWT consists of a header (token type and signing algorithm), a payload (claims such as the user ID and expiration), and a signature. The signature detects changes; it does not encrypt the payload, so do not put passwords or secrets in it. This API uses short-lived signed access tokens for authenticated requests and separate, longer-lived refresh tokens to obtain new access tokens.

## Exercises to extend

- Add email confirmation with one-time, expiring tokens.
- Add role claims and authorization checks for specific routes.
- Add account recovery and password changes that revoke every refresh session.
- Add pagination and more profile fields.
- Consider CSRF protection and origin checks if the API is deployed across sites or accepts cross-site cookie requests.

## Security notes

- Keep access and refresh secrets separate and outside source control; rotate them if exposed.
- Use HTTPS in production. `HttpOnly` helps prevent script access to cookies but does not replace XSS prevention or CSRF defenses.
- Keep dependencies updated and configure rate limiting and monitoring appropriate to your deployment.
- This is a learning example. Review the deployment, cookie, CSRF, key-rotation, and account-recovery requirements for your application before production use.
