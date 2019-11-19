const express = require('express');
const router = express.Router();
const data = require("../data");
const notes = data.notes;

router.get('/', async(req, res) => {
    try {
        const notesAll = await notes.getAllNotes();
        res.render("home", { allNotes: notesAll });
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})

module.exports = router