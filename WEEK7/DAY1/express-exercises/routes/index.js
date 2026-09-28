const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Welcome to the Express exercises homepage.");
});

router.get("/about", (req, res) => {
	res.send("About Us: a simple Express.js application using express.Router.");
});

module.exports = router;