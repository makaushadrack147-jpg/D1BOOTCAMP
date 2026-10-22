import { createHash, randomUUID } from "node:crypto";
import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ACCESS_COOKIE = "access_token";
const REFRESH_COOKIE = "refresh_token";
const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

function publicUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    displayName: user.display_name,
  };
}

function setAuthCookies(res, accessToken, refreshToken, config) {
  const sharedOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
  };

  res.cookie(ACCESS_COOKIE, accessToken, {
    ...sharedOptions,
    path: "/api",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...sharedOptions,
    path: "/api/auth",
    maxAge: config.refreshTokenTtlSeconds * 1000,
  });
}

function clearAuthCookies(res, config) {
  const sharedOptions = {
    httpOnly: true,
    secure: config.nodeEnv === "production",
    sameSite: "lax",
  };
  res.clearCookie(ACCESS_COOKIE, { ...sharedOptions, path: "/api" });
  res.clearCookie(REFRESH_COOKIE, { ...sharedOptions, path: "/api/auth" });
}

function signAccessToken(userId, config) {
  return jwt.sign(
    { sub: String(userId), jti: randomUUID() },
    config.accessTokenSecret,
    {
      expiresIn: config.accessTokenTtl,
      issuer: "jwt-auth-exercise",
      audience: "jwt-auth-api",
    },
  );
}

function signRefreshToken(userId, config) {
  return jwt.sign(
    { sub: String(userId), jti: randomUUID() },
    config.refreshTokenSecret,
    {
      expiresIn: config.refreshTokenTtl,
      issuer: "jwt-auth-exercise",
      audience: "jwt-auth-refresh",
    },
  );
}

function issueTokens(userId, db, config) {
  const accessToken = signAccessToken(userId, config);
  const refreshToken = signRefreshToken(userId, config);
  const expiresAt = Math.floor(Date.now() / 1000) + config.refreshTokenTtlSeconds;

  db.prepare(`
    INSERT INTO refresh_sessions (user_id, token_hash, expires_at)
    VALUES (?, ?, ?)
  `).run(userId, hashToken(refreshToken), expiresAt);

  return { accessToken, refreshToken };
}

function verifyAccessToken(token, config) {
  return jwt.verify(token, config.accessTokenSecret, {
    issuer: "jwt-auth-exercise",
    audience: "jwt-auth-api",
  });
}

export function createAuthRouter(db, config) {
  const router = Router();
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many authentication attempts. Try again later." },
  });
  const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Too many refresh attempts. Try again later." },
  });

  router.post("/register", loginLimiter, async (req, res, next) => {
    const { username, email, password } = req.body ?? {};
    if (
      typeof username !== "string" ||
      !USERNAME_PATTERN.test(username) ||
      typeof email !== "string" ||
      !EMAIL_PATTERN.test(email) ||
      email.length > 254 ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password, "utf8") > 72
    ) {
      return res.status(400).json({
        error: "Provide a 3-30 character username, valid email, and password of 8-72 bytes.",
      });
    }

    try {
      const normalizedUsername = username.toLowerCase();
      const normalizedEmail = email.toLowerCase();
      const passwordHash = await bcrypt.hash(password, 12);
      const result = db.prepare(`
        INSERT INTO users (username, email, password_hash, display_name)
        VALUES (?, ?, ?, ?)
      `).run(normalizedUsername, normalizedEmail, passwordHash, username);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
      const tokens = issueTokens(user.id, db, config);

      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, config);
      return res.status(201).json({ user: publicUser(user) });
    } catch (error) {
      if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(409).json({ error: "That username or email is already registered." });
      }
      return next(error);
    }
  });

  router.post("/login", loginLimiter, async (req, res, next) => {
    const { username, password } = req.body ?? {};
    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ error: "Username and password are required." });
    }

    try {
      const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username.toLowerCase());
      const passwordMatches = user && await bcrypt.compare(password, user.password_hash);
      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      const tokens = issueTokens(user.id, db, config);
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, config);
      return res.json({ user: publicUser(user) });
    } catch (error) {
      return next(error);
    }
  });

  router.post("/refresh", refreshLimiter, (req, res) => {
    const oldToken = req.cookies?.[REFRESH_COOKIE];
    if (!oldToken) {
      return res.status(401).json({ error: "Refresh token is required." });
    }

    let claims;
    try {
      claims = jwt.verify(oldToken, config.refreshTokenSecret, {
        issuer: "jwt-auth-exercise",
        audience: "jwt-auth-refresh",
      });
    } catch {
      clearAuthCookies(res, config);
      return res.status(401).json({ error: "Refresh token is invalid or expired." });
    }

    const oldHash = hashToken(oldToken);
    const session = db.prepare(`
      SELECT id, user_id FROM refresh_sessions
      WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > ?
    `).get(oldHash, Math.floor(Date.now() / 1000));
    if (!session || String(session.user_id) !== claims.sub) {
      clearAuthCookies(res, config);
      return res.status(401).json({ error: "Refresh token is invalid or has been revoked." });
    }

    const replaceSession = db.transaction(() => {
      const revoked = db.prepare(`
        UPDATE refresh_sessions SET revoked_at = ?
        WHERE id = ? AND revoked_at IS NULL
      `).run(Math.floor(Date.now() / 1000), session.id);
      if (revoked.changes !== 1) return null;
      return issueTokens(session.user_id, db, config);
    });
    const tokens = replaceSession();
    if (!tokens) {
      clearAuthCookies(res, config);
      return res.status(401).json({ error: "Refresh token has already been used." });
    }

    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, config);
    return res.json({ message: "Tokens refreshed." });
  });

  router.post("/logout", (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE];
    if (refreshToken) {
      db.prepare(`
        UPDATE refresh_sessions SET revoked_at = ?
        WHERE token_hash = ? AND revoked_at IS NULL
      `).run(Math.floor(Date.now() / 1000), hashToken(refreshToken));
    }
    clearAuthCookies(res, config);
    return res.status(204).end();
  });

  router.get("/me", (req, res) => {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) {
      return res.status(401).json({ error: "Authentication is required." });
    }

    try {
      const claims = verifyAccessToken(token, config);
      const user = db.prepare("SELECT * FROM users WHERE id = ?").get(Number(claims.sub));
      if (!user) return res.status(401).json({ error: "Authentication is required." });
      return res.json({ user: publicUser(user) });
    } catch {
      return res.status(401).json({ error: "Access token is invalid or expired." });
    }
  });

  return router;
}

export function requireAuth(config) {
  return (req, res, next) => {
    const token = req.cookies?.[ACCESS_COOKIE];
    if (!token) return res.status(401).json({ error: "Authentication is required." });

    try {
      const claims = verifyAccessToken(token, config);
      req.userId = Number(claims.sub);
      return next();
    } catch {
      return res.status(401).json({ error: "Access token is invalid or expired." });
    }
  };
}
