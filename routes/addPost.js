const express = require('express');
const router = express.Router();
const data = require("../data");
const tags=data.tags;
const notes = data.notes;
const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        next();
    }
}
router.get('/', async(req, res) => {
    try {
        res.render("addPost",{ title: "AddPost page" ,tags: tags});
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})
router.post('/',loginMiddleware, async(req, res) => {
    console.log(req.body)
    try {
        if (!req.body) return res.status(400).render("addPost", { title: "AddPost Page", error: "Bad Request" });
        if (!req.body.note_title || !req.body.NoteContent || !req.body.radius || !req.body.latitude || !req.body.longitude) {
            return res.status(400).render("addPost", { title: "AddPost page", error: "One of the fileds is missing" })
        }
        
        await notes.createNotes(req.session.userInfo._id,req.body.note_title,req.body.NoteContent,req.body.radius,req.body.latitude,req.body.longitude, req.body.tags)
       // res.cookie("userData", { "message": req.body.firstName + " is Successfully Signed up!" });
        return res.redirect("/addPost");
    } catch (e) {
        console.log(e)
        return res.status(404).render("addPost", { title: "AddPost page", error: e })
    }
    // res.redirect('/signup')
})

module.exports = router