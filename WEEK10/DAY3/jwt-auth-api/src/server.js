import { createApp } from "./app.js";
import { getConfig } from "./config.js";
import { createDatabase } from "./db.js";

const config = getConfig();
const db = createDatabase(config.databasePath);
const app = createApp(db, config);

const server = app.listen(config.port, () => {
  console.log(`JWT auth API listening on http://localhost:${config.port}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
