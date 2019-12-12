const express = require('express');
const router = express.Router();
const data = require("../data");
const tags=data.tags;
const notes = data.notes;
const comments = data.comments
const users = data.users;

const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        next();
    }
}
router.get('/', loginMiddleware,async(req, res) => {
    try {
        var userNotes = await notes.findNotesByUserID(req.session.userInfo._id)
        for(let i=0;i<userNotes.length;i++){
            userNotes[i].userID = '"' + userNotes[i].userID +'"'
            userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'
            for(let j=0; j<userNotes[i].comments.length ;j++){
                var {userInfo, commentOne} = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                userNotes[i].comments[j].name = userInfo.firstName+ " "+userInfo.lastName 
                userNotes[i].comments[j].commented_at = commentOne.commented_at
                userNotes[i].comments[j].description = commentOne.description
            }
        }
        // console.log(userNotes[0].comments)
        return res.status(200).render("addPost",{ title: "AddPost page" ,tags: tags, "notes":userNotes});
    } catch (e) {
        res.status(404).json({ "error": e });
    }
})
router.post('/',loginMiddleware, async(req, res) => {
    try {
        console.log(req.body)
        if(!req.body.latitude && !req.body.longitude){
            req.body.latitude = 40.745094
            req.body.longitude = -74.024255
        }
        if (!req.body) return res.status(400).render("addPost", { title: "AddPost Page", error: "Bad Request" });
        // if 404 status the js files are not loaded properly & html will be mpty always
        if (!req.body.note_title || !req.body.NoteContent || !req.body.radius) {
            return res.status(400).render("addPost", { title: "AddPost page", error: "One of the fileds is missing" })
        }
        
        await notes.createNotes(req.session.userInfo._id,req.body.note_title,req.body.NoteContent,req.body.radius,req.body.latitude,req.body.longitude, req.body.tags)
       // res.cookie("userData", { "message": req.body.firstName + " is Successfully Signed up!" });
        return res.redirect("/addPost");
    } catch (e) {
        console.log("Hey I am entering")
        return res.status(404).render("addPost", { title: "AddPost page", error: e })
    }
    // res.redirect('/signup')
})

router.post('/comment',loginMiddleware, async(req, res) => {
    try {
        if (!req.body) return res.status(400).json({ error: true, errormsg: "Bad Request!" });
        if (!req.body.note_id || !req.body.user_id || !req.body.comment) {
            return res.json({ error: true, errormsg:  "One of the fileds is missing!" })
        }
        
        var comment_posted = await comments.createComment(req.body.note_id, req.session.userInfo._id, req.body.comment)
        var {firstName, lastName} = await users.getUserByID(comment_posted.userid)
        comment_posted.name = firstName+" "+lastName
        console.log(comment_posted)
        return res.json({ error: false, "data": comment_posted });
    } catch (e) {
        return res.json({ error: true, errormsg: e });
    }
    // res.redirect('/signup')
})


module.exports = router