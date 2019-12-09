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

router.post('/',loginMiddleware, async(req, res) => {

    try {
        if (!req.body) return res.status(400).render("home", { title: "home Page", error: "Bad Request" });
        if (!req.body.note_title || !req.body.NoteContent || !req.body.radius || !req.body.latitude || !req.body.longitude) {
            return res.status(400).render("home", { title: "home page", error: "One of the fileds is missing" })
        }
        
        await notes.createNotes(req.session.userInfo._id,req.body.note_title,req.body.NoteContent,req.body.radius,req.body.latitude,req.body.longitude)
       // res.cookie("userData", { "message": req.body.firstName + " is Successfully Signed up!" });
        return res.redirect("/home");
    } catch (e) {
        console.log(e)
        return res.status(404).render("home", { title: "home page", error: e })
    }
    // res.redirect('/signup')
})

module.exports = router