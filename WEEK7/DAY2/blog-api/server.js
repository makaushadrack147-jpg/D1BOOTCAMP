const app = require("./server/app");
const posts = require("./server/models/postModel");
const db = require("./server/config/db");

const port = Number(process.env.PORT) || 3000;

async function start() {
	await posts.initialize();
	app.listen(port, () => {
		console.log(`Blog API running at http://localhost:${port}`);
	});
}

if (require.main === module) {
	start().catch(async (error) => {
		console.error("Failed to start the Blog API:", error);
		await db.end();
		process.exitCode = 1;
	});
}

module.exports = app;