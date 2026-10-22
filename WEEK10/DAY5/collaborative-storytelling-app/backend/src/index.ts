import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import { config } from "./config.js"
import { errorHandler, notFound } from "./middleware/errors.js"
import authRoutes from "./routes/auth.js"
import contributorRoutes from "./routes/contributors.js"
import storyRoutes from "./routes/stories.js"
import userRoutes from "./routes/users.js"

const app = express()
app.disable("x-powered-by")
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === config.frontendUrl) {
      callback(null, true)
      return
    }
    if (!config.production) {
      try {
        const url = new URL(origin)
        callback(null, url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))
        return
      } catch {
        callback(null, false)
        return
      }
    }
    callback(null, false)
  },
  credentials: true,
}))
app.use(express.json({ limit: "64kb" }))
app.use(cookieParser())
app.get("/api/health", (_req, res) => res.json({ status: "ok" }))
app.use("/api/auth", authRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/contributors", contributorRoutes)
app.use("/api/users", userRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(config.port, () => {
  console.log(`Storytelling API listening on port ${config.port}`)
})
