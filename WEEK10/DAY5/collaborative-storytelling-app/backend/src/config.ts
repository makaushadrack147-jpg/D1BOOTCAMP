import "dotenv/config"

const required = (name: string): string => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required("DATABASE_URL"),
  jwtSecret: required("JWT_SECRET"),
  refreshSecret: required("REFRESH_SECRET"),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  production: process.env.NODE_ENV === "production",
}
