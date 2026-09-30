const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");
const notes = require("./notes");

yargs(hideBin(process.argv))
	.command("add", "Add a note", {
		title: { describe: "Note title", type: "string", demandOption: true },
		body: { describe: "Note body", type: "string", demandOption: true },
	}, (args) => {
		if (notes.addNote({ title: args.title, body: args.body })) {
			console.log("New note created");
		} else {
			console.log("Note already exists");
		}
	})
	.command("list", "List all notes", {}, () => {
		const allNotes = notes.getAllNotes();
		if (allNotes.length === 0) {
			console.log("No notes found");
			return;
		}
		console.log("Your notes:");
		allNotes.forEach((note) => console.log(`- ${note.title}`));
	})
	.command("read", "Read a note", {
		title: { describe: "Note title", type: "string", demandOption: true },
	}, (args) => {
		const note = notes.getNote(args.title);
		if (!note) {
			console.log("Note not found");
			return;
		}
		console.log(`Title: ${note.title}`);
		console.log(`Body: ${note.body}`);
	})
	.command("remove", "Remove a note", {
		title: { describe: "Note title", type: "string", demandOption: true },
	}, (args) => {
		console.log(notes.removeNote(args.title) ? "Note removed" : "Note not found");
	})
	.demandCommand(1)
	.strictCommands()
	.help()
	.fail((message, error) => {
		if (error) console.error(error.message);
		else console.log("command not recognized");
		process.exitCode = 1;
	})
	.parse();