const express = require('express');
const router = express.Router();
const data = require("../data");
const notes = data.notes;
const comments = data.comments
const tags=data.tags;
const users = data.users;

const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        next();
    }
}
router.get('/', loginMiddleware, async(req, res) => {
    var latitute = req.session.latitude;
    var longitude = req.session.longitude;

    var radius = 5;
    try {
        var userNotes = await notes.findNotes(latitute, longitude, radius);
        for(let i=0;i<userNotes.length;i++){
            const {firstName, lastName} = await users.getUserByID(userNotes[i].userID)
            userNotes[i].name = firstName+" "+lastName
            userNotes[i].userID = '"' + userNotes[i].userID +'"'
            userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'
            
            for(let j=0; j<userNotes[i].comments.length ;j++){
                var {userInfo, commentOne} = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                userNotes[i].comments[j].name = userInfo.firstName+ " "+userInfo.lastName 
                userNotes[i].comments[j].commented_at = commentOne.commented_at
                userNotes[i].comments[j].description = commentOne.description
            }
        }
        
        res.render("home", { title: "Pied Piper", "notes": userNotes});
    } catch (e) {
        res.status(404).json({ "error": e });
    }
})

// router.post('/',loginMiddleware, async(req, res) => {
//     console.log(req.body)
//     try {
//         if (!req.body) return res.status(400).render("home", { title: "home Page", error: "Bad Request" });
//         if (!req.body.note_title || !req.body.NoteContent || !req.body.radius || !req.body.latitude || !req.body.longitude) {
//             return res.status(400).render("home", { title: "home page", error: "One of the fileds is missing" })
//         }
        
//         await notes.createNotes(req.session.userInfo._id,req.body.note_title,req.body.NoteContent,req.body.radius,req.body.latitude,req.body.longitude, req.body.tags)
//        // res.cookie("userData", { "message": req.body.firstName + " is Successfully Signed up!" });
//         return res.redirect("/home");
//     } catch (e) {
//         console.log(e)
//         return res.status(404).render("home", { title: "home page", error: e })
//     }
//     // res.redirect('/signup')
// })

module.exports = router