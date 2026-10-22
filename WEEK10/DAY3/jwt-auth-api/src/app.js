import express from "express";
import cookieParser from "cookie-parser";
import { createAuthRouter, requireAuth } from "./auth.js";

export function createApp(db, config) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "10kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", createAuthRouter(db, config));

  app.get("/api/profile", requireAuth(config), (req, res) => {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.userId);
    if (!user) return res.status(404).json({ error: "User not found." });
    return res.json({
      profile: {
        username: user.username,
        email: user.email,
        displayName: user.display_name,
      },
    });
  });

  app.patch("/api/profile", requireAuth(config), (req, res) => {
    const { displayName } = req.body ?? {};
    if (
      typeof displayName !== "string" ||
      displayName.trim().length < 1 ||
      displayName.trim().length > 60
    ) {
      return res.status(400).json({ error: "displayName must be between 1 and 60 characters." });
    }

    db.prepare("UPDATE users SET display_name = ? WHERE id = ?")
      .run(displayName.trim(), req.userId);
    return res.json({ profile: { displayName: displayName.trim() } });
  });

  app.use((_req, res) => res.status(404).json({ error: "Route not found." }));
  app.use((error, _req, res, _next) => {
    if (error instanceof SyntaxError && "body" in error) {
      return res.status(400).json({ error: "Request body must contain valid JSON." });
    }
    console.error(error);
    return res.status(500).json({ error: "An unexpected server error occurred." });
  });

  return app;
}
