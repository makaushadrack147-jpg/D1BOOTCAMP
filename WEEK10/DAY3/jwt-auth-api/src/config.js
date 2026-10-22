import "dotenv/config";

function readSecret(name) {
  const secret = process.env[name];
  if (!secret || secret.length < 32) {
    throw new Error(`${name} must be set to a secret of at least 32 characters.`);
  }
  return secret;
}

export function getConfig() {
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return {
    port,
    nodeEnv: process.env.NODE_ENV ?? "development",
    databasePath: process.env.DATABASE_PATH ?? "./data/auth.sqlite",
    accessTokenSecret: readSecret("ACCESS_TOKEN_SECRET"),
    refreshTokenSecret: readSecret("REFRESH_TOKEN_SECRET"),
    accessTokenTtl: "15m",
    refreshTokenTtl: "7d",
    refreshTokenTtlSeconds: 7 * 24 * 60 * 60,
  };
}
