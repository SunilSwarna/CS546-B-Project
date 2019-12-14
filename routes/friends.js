const express = require('express');
const router = express.Router();
const data = require("../data");
const tags = data.tags;
const notes = data.notes;
const comments = data.comments
const users = data.users;
const xss = require("xss");

const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        res.locals.testName = req.session.userInfo.firstName + " " + req.session.userInfo.lastName
        next();
    }
}

router.get('/', loginMiddleware, async (req, res) => {
    try {
        var logged_info = req.session.userInfo
        var { friends } = await data.friends.get(logged_info.friendID)

        var frds = []
        if (friends.length) {
            for (let i = 0; i < friends.length; i++) {
                if (friends[i].status == 0) {
                    var user_details = await data.users.getUserByID(friends[i].friendID)
                    var name = user_details.firstName + " " + user_details.lastName
                    name = name.replace(/\s+/g, ' ').trim();
                    var userId = '"' + friends[i].friendID.replace(/'/g, '"') + '"';
                    frds.push({ "userId": userId, "name": name.toUpperCase() })
                }
            }
        }
        // console.log(frds)
        var showFrds = frds.length > 0 ? true : false
        return res.render("friends", { title: "Friends", frds, showFrds });
    } catch (e) {
        res.status(404).json({ "error": e });
    }
})

router.post('/search', loginMiddleware, async (req, res) => {
    try {
        // validate if body.name is there if not throw error
        if (!req.body.name) throw "Name is not provided in request!"
        var name = xss(req.body.name, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        var logged_info = req.session.userInfo
        const db_results = await data.friends.searchName(name);
        var name_results = db_results.filter(user => {
            return user.friendID != logged_info.friendID;
        });
        const { friends } = await data.friends.get(logged_info.friendID)
        var temp_name_results = []
        if (friends.length == 0) temp_name_results = name_results
        if (friends.length && name_results.length) {

            for (let j = 0; j < name_results.length; j++) {
                var user = name_results[j]
                var flag = 0
                for (let i = 0; i < friends.length; i++) {
                    if (friends[i].friendID == user._id && friends[i].status == 0) {
                        flag = 1
                        break;
                    }
                    if (friends[i].friendID == user._id && friends[i].status == 1) {
                        name_results[j].status = 1
                        temp_name_results.push(name_results[j])
                        flag = 1
                        break
                    }
                    if (friends[i].friendID == user._id && friends[i].status == 2) {
                        name_results[j].status = 2
                        temp_name_results.push(name_results[j])
                        flag = 1
                        break
                    }
                }
                if (flag == 0) {
                    temp_name_results.push(name_results[j])
                }

            }
        }
        var found = temp_name_results.length > 0 ? true : false

        res.json({ name, temp_name_results, found });
    } catch (e) {
        res.status(404).render("errors", { "error": e });
    }
})

router.get('/id/:userid', loginMiddleware, async (req, res) => {
    if (!req.params.userid) return res.json({ error: "Bad Request! Missing parameter" })
    var userid = xss(req.params.userid, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
    try {
        var userNotes = await notes.findNotesByUserID(userid)
        const { firstName, lastName } = await users.getUserByID(userid)

        for (let i = 0; i < userNotes.length; i++) {
            userNotes[i].userID = '"' + userNotes[i].userID + '"'
            userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'
            userNotes[i].name = firstName + " " + lastName
            for (let j = 0; j < userNotes[i].comments.length; j++) {
                var { userInfo, commentOne } = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                userNotes[i].comments[j].name = userInfo.firstName + " " + userInfo.lastName
                userNotes[i].comments[j].commented_at = commentOne.commented_at
                userNotes[i].comments[j].description = commentOne.description
            }
        }
        // console.log(userNotes[0].comments)
        return res.status(200).render("posts", { title: "AddPost page", tags: tags, "notes": userNotes });
    } catch (e) {
        res.status(404).render("errors", { "error": e });
    }

})

router.post("/add/:id", loginMiddleware, async (req, res) => {

    // 2 in the loggedin user db & 0 in the requested user db
    try {
        if (!req.params.id) throw "Friend Id is not provided";
        var friend_id = xss(req.params.id, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
        // var friend_id = req.params.id; // friend object id
        var db_friend_id = await data.friends.get(friend_id) // get userId of friend
        var logged_info = req.session.userInfo
        // addFriend takes logged user friendId, logged user object-id, friend-user id
        const addFriend = await data.friends.addFriend(logged_info.friendID, logged_info._id, db_friend_id.userID)
        res.json({ addFriend });
    }
    catch (e) {
        res.json({ "added": false });
    }
});

router.post("/accept/:id", loginMiddleware, async (req, res) => {
    var friend_user_id = xss(req.params.id, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })
    // var friend_user_id = req.params.id;
    // var db_friend_id = await data.friends.get(friend_id)
    var logged_info = req.session.userInfo
    // acceptFriend takes logged user friendId, logged user object-id, friend-user id
    try {
        const acceptFriend = await data.friends.approveFriend(logged_info.friendID, logged_info._id, friend_user_id)
        res.json({ acceptFriend });

    }
    catch (e) {
        res.json({ "error": e })
    }
});

router.post("/delete/:id", loginMiddleware, async (req, res) => {
    var friend_user_id = xss(req.params.id, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })

    // var db_friend_id = await data.friends.get(friend_id)
    var logged_info = req.session.userInfo
    // acceptFriend takes logged user friendId, logged user object-id, friend-user id
    try {
        const removeFriend = await data.friends.removeFriend(logged_info.friendID, logged_info._id, friend_user_id)
        res.json({ removeFriend });

    }
    catch (e) {
        res.json({ "error": e })
    }
});

router.get('/posts',loginMiddleware, async (req, res) => {
    try {

        return res.render("friendsposts", {});
    } catch (e) {
        res.status(404).render("errors", { "error": e });
    }
})

router.post('/getPosts/name',loginMiddleware, async (req, res) => {
    try {
        var name= xss(req.body.name, { whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: ["script"] })

        // var name = req.body.name
        var logged_info = req.session.userInfo
        const db_results = await data.friends.searchName(name);

        var name_results = db_results.filter(user => {
            return user.friendID != logged_info.friendID;
        }); // get name based search

        const { friends } = await data.friends.get(logged_info.friendID)
        var temp_name_results = []
        // if (friends.length == 0) temp_name_results = name_results
        if (friends.length && name_results.length) {

            for (let j = 0; j < name_results.length; j++) {
                var user = name_results[j]

                for (let i = 0; i < friends.length; i++) {
                    if (friends[i].friendID == user._id && friends[i].status == 1) {
                        temp_name_results.push(name_results[j])
                        break
                    }
                }
            }
        }
        var found = temp_name_results.length > 0 ? true : false

        return res.json({ name, temp_name_results, found });
        // return res.json({ name: req.body.name })
    } catch (e) {
        // render to friendsposts with error 
        res.status(404).render("errors", { "error": e });
    }
})

module.exports = router