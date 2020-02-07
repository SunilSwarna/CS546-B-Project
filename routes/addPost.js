const express = require('express');
const router = express.Router();
const data = require("../data");
const tags=data.tags;
const notes = data.notes;
const comments = data.comments
const users = data.users;
const xss = require("xss");

const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        res.locals.testName =  req.session.userInfo.firstName+" "+ req.session.userInfo.lastName
        next();
    }
}

router.get('/', loginMiddleware,async(req, res) => {
    try {
        var userNotes = await notes.findNotesByUserID(req.session.userInfo._id)
        var name = req.session.userInfo.firstName+" "+req.session.userInfo.lastName
        for(let i=0;i<userNotes.length;i++){
            userNotes[i].userID = '"' + userNotes[i].userID +'"'
            userNotes[i].editid = userNotes[i]._id
            userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'

            userNotes[i].name = name
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
        res.status(404).render("errors",{ title:"error",error: e });
    }
})
router.get('/edit/:id', loginMiddleware,async(req, res) => {
    try {
        
        if(! req.params.id) throw "Post id is not given"
        req.params.id = xss(req.params.id, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        var note_id = req.params.id
        var editNote = await notes.getNoteById(note_id);
        let modiftag= tags;
        for(i=0;i<tags.length;i++){
            modiftag[i].sel=false;
        }

        for(i=0;i<editNote.tags.length;i++){
            for(j=0;j<tags.length;j++){
                if(editNote.tags[i]==tags[j].tag){
                    modiftag[j].sel=true;
                }
            }
        }
        // console.log(modiftag)
        return res.status(200).render("editnote",{ title: "edit page" ,tags: modiftag, note:editNote});
        }
        // console.log(userNotes[0].comments)
       
     catch (e) {
         console.log(e)
         res.status(404).render("errors",{ title:"error",error: e });
    }
})


router.post('/edit/:id', loginMiddleware,async(req, res) => {

    try {
        if(!req.params.id) throw "Post id is not given"
        req.params.id = xss(req.params.id, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
    
        if (!req.body.note_title || !req.body.note_content || !req.body.radius) {
            return res.status(400).render("addPost", { title: "AddPost page", error: "One of the fileds is missing" })
        }
        req.body.note_title = xss(req.body.note_title, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        req.body.note_content = xss(req.body.note_content, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        req.body.radius = xss(req.body.radius, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        if(!req.body.tags){
            req.body.tags = []
        }
        await notes.updateNote(req.params.id,req.body.note_title,req.body.note_content,req.body.radius,req.body.tags)
        return res.redirect("/addPost");
    } catch (e) {
        console.log(e)
        return res.status(404).render("addPost", { title: "AddPost page", error: e })
    }
})

router.post('/',loginMiddleware, async(req, res) => {
    try {
        // console.log(req.body)
        if(!req.body.latitude && !req.body.longitude){
            req.body.latitude = 40.745094
            req.body.longitude = -74.024255
        }
        if (!req.body) return res.status(400).render("addPost", { title: "AddPost Page", error: "Bad Request" });
        // if 404 status the js files are not loaded properly & html will be mpty always
        if (!req.body.note_title || !req.body.NoteContent || !req.body.radius) {
            return res.status(400).render("addPost", { title: "AddPost page", error: "One of the fileds is missing" })
        }
        if(!req.body.tags){
            req.body.tags = []
        }
        req.body.note_title = xss(req.body.note_title, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        req.body.NoteContent = xss(req.body.NoteContent, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        req.body.radius = xss(req.body.radius, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })

        await notes.createNotes(req.session.userInfo._id,req.body.note_title,req.body.NoteContent,req.body.radius,req.body.latitude,req.body.longitude, req.body.tags)
       // res.cookie("userData", { "message": req.body.firstName + " is Successfully Signed up!" });
        return res.redirect("/addPost");
    } catch (e) {
      
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
        req.body.comment = xss(req.body.comment, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })

        var comment_posted = await comments.createComment(req.body.note_id, req.session.userInfo._id, req.body.comment)
        var {firstName, lastName} = await users.getUserByID(comment_posted.userid)
        comment_posted.name = firstName+" "+lastName
        return res.json({ error: false, "data": comment_posted });
    } catch (e) {
        return res.json({ error: true, errormsg: e });
    }
    // res.redirect('/signup')
})

router.delete("/deletnote/:noteid", loginMiddleware,async (req, res) => {
    if(!req.params.noteid) throw "Noteid not provided"

    var note_id = req.params.noteid; // friend object id
    try{
        note_id = xss(note_id, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })

        var deleted_note = await notes.deleteNote(note_id)
        return res.json({deleted: true, "data":deleted_note})
    }
    catch(e){
        return res.json({deleted: false, "data":[], error:e})
    }
});

module.exports = router