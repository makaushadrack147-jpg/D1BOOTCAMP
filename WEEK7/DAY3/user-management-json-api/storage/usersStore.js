const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const usersFile = path.join(__dirname, "..", "users.json");
let writeQueue = Promise.resolve();
let tempFileId = 0;

async function read() {
	try {
		const users = JSON.parse(await fs.readFile(usersFile, "utf8"));
		if (!Array.isArray(users)) throw new Error("User storage must contain a JSON array");
		return users;
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}

async function write(users) {
	const temporaryFile = `${usersFile}.${process.pid}.${tempFileId++}.tmp`;
	try {
		await fs.writeFile(temporaryFile, `${JSON.stringify(users, null, 2)}\n`, "utf8");
		await fs.rename(temporaryFile, usersFile);
	} catch (error) {
		await fs.unlink(temporaryFile).catch(() => {});
		throw error;
	}
}

function mutate(operation) {
	const result = writeQueue.then(async () => {
		const users = await read();
		const outcome = await operation(users);
		if (outcome.save) await write(users);
		return outcome.value;
	});
	writeQueue = result.then(() => undefined, () => undefined);
	return result;
}

module.exports = { read, mutate, createId: randomUUID };