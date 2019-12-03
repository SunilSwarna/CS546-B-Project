const express = require('express');
const router = express.Router();
const data = require("../data");
const notes = data.notes;

const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        next();
    }
}
router.get('/', loginMiddleware, async(req, res) => {
    var latitute = 44.5235792;
    var longitude = -89.574563;
    var radius = 5;
    try {
        const notesAll = await notes.findNotes(latitute, longitude, radius);
        res.render("home", { title: "Pied Piper", allNotes: notesAll });
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})

module.exports = router