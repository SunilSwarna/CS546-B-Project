const express = require('express');
const router = express.Router();
const data = require("../data");
const notes = data.notes;

router.get('/', async(req, res) => {
    try {
        res.render("friends", {});
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})

module.exports = router