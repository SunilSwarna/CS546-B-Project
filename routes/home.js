const express = require('express');
const router = express.Router();
const data = require("../data");
const notes = data.notes;
const comments = data.comments
const tags = data.tags;

const users = data.users;

const loginMiddleware = (req, res, next) => {
    if (!req.session.logged) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        res.locals.testName =  req.session.userInfo.firstName+" "+ req.session.userInfo.lastName
        next();
    }
}
router.get('/', loginMiddleware, async (req, res) => {
    var latitute = req.session.latitude;
    var longitude = req.session.longitude;

    var radius = 5;
    try {
        var userNotes = await notes.findNotes(latitute, longitude, radius);
        for (let i = 0; i < userNotes.length; i++) {
            const { firstName, lastName } = await users.getUserByID(userNotes[i].userID)
            userNotes[i].name = firstName + " " + lastName
            userNotes[i].userID = '"' + userNotes[i].userID + '"'
            userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'

            for (let j = 0; j < userNotes[i].comments.length; j++) {
                var { userInfo, commentOne } = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                userNotes[i].comments[j].name = userInfo.firstName + " " + userInfo.lastName
                userNotes[i].comments[j].commented_at = commentOne.commented_at
                userNotes[i].comments[j].description = commentOne.description
            }
        }
        res.render("home", { title: "Pied Piper", "notes": userNotes, "tags": tags });
    } catch (e) {
        res.status(404).json({ "error": e });
    }
})

const getPostsFilter = async function getPostsFilter(latitute, longitude, radius, friends_ids) {
    var userNotes = await notes.findNotes(latitute, longitude, radius);
    var filterNotes = []
    for (let i = 0; i < userNotes.length; i++) {

        if (friends_ids.includes(userNotes[i].userID)) {
            const { firstName, lastName } = await users.getUserByID(userNotes[i].userID)
            userNotes[i].name = firstName + " " + lastName
            userNotes[i].userID = '"' + userNotes[i].userID + '"'
            userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'

            for (let j = 0; j < userNotes[i].comments.length; j++) {
                var { userInfo, commentOne } = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                userNotes[i].comments[j].name = userInfo.firstName + " " + userInfo.lastName
                userNotes[i].comments[j].commented_at = commentOne.commented_at
                userNotes[i].comments[j].description = commentOne.description
            }
            filterNotes.push(userNotes[i])
        }
    }
    return filterNotes
}

const getPostsFilterByTags = async function getPostsFilterByTags(latitute, longitude, radius, tags, friends_ids) {

    var userNotes = await notes.findNotes(latitute, longitude, radius);
    var filterNotes = []

    if (friends_ids) {
      
        for (let i = 0; i < userNotes.length; i++) {

            if (friends_ids.includes(userNotes[i].userID)) {
                var userTags = userNotes[i].tags
                const result = tags.every(val => userTags.includes(val));
                if (result == true) {
                    const { firstName, lastName } = await users.getUserByID(userNotes[i].userID)
                    userNotes[i].name = firstName + " " + lastName
                    userNotes[i].userID = '"' + userNotes[i].userID + '"'
                    userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'

                    for (let j = 0; j < userNotes[i].comments.length; j++) {
                        var { userInfo, commentOne } = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                        userNotes[i].comments[j].name = userInfo.firstName + " " + userInfo.lastName
                        userNotes[i].comments[j].commented_at = commentOne.commented_at
                        userNotes[i].comments[j].description = commentOne.description
                    }
                    filterNotes.push(userNotes[i])
                }
            }
        }
        return filterNotes
    }

    else {
        for (let i = 0; i < userNotes.length; i++) {
            const { firstName, lastName } = await users.getUserByID(userNotes[i].userID)
            var userTags = userNotes[i].tags
            const result = tags.every(val => userTags.includes(val));
            if (result == true) {
                userNotes[i].name = firstName + " " + lastName
                userNotes[i].userID = '"' + userNotes[i].userID + '"'
                userNotes[i]._id = '"' + String(userNotes[i]._id) + '"'

                for (let j = 0; j < userNotes[i].comments.length; j++) {
                    var { userInfo, commentOne } = await comments.getUserNamebyComment(userNotes[i].comments[j].commentID)
                    userNotes[i].comments[j].name = userInfo.firstName + " " + userInfo.lastName
                    userNotes[i].comments[j].commented_at = commentOne.commented_at
                    userNotes[i].comments[j].description = commentOne.description
                }
                filterNotes.push(userNotes[i])
            }
        }
    }
    return filterNotes
}
router.post('/', loginMiddleware, async (req, res) => {
    // console.log(req.body)
    if (!req.body.tags && !req.body.onlyFriends) throw "Missing array tags & onlyFriends value"
    var filertags = req.body.tags
    var selectedFriends = req.body.onlyFriends
    var latitute = req.session.latitude;
    var longitude = req.session.longitude;

    var radius = 5;
    if (filertags && selectedFriends) {
        var friend_id_logged_user = req.session.userInfo.friendID
        const { friends } = await data.friends.get(friend_id_logged_user)
        if (friends.length == 0) {
            return res.render("home", { title: "Pied Piper", "notes": [], "tags": tags });
        }
        else {
            try {
                var friends_posts_user_ids = []
                for (let i = 0; i < friends.length; i++) {
                    if (friends[i].status == 1) {
                        friends_posts_user_ids.push(friends[i].friendID)
                    }
                }
                if (Array.isArray(filertags)) {
                    var userNotes = await getPostsFilterByTags(latitute, longitude, radius, filertags, friends_posts_user_ids)
                    return res.render("home", { title: "Pied Piper", "notes": userNotes, "tags": tags });
                }
                else {
                    var tags_array = []
                    tags_array.push(filertags)
                    var userNotes = await getPostsFilterByTags(latitute, longitude, radius, tags_array, friends_posts_user_ids)
                    return res.render("home", { title: "Pied Piper", "notes": userNotes, "tags": tags });

                }
            }
            catch (e) {
                return res.json({ error: e })
            }
        }
    }
    else if (filertags && !selectedFriends) {
        try {

            if (Array.isArray(filertags)) {
                var userNotes = await getPostsFilterByTags(latitute, longitude, radius, filertags)
                return res.render("home", { title: "Pied Piper", "notes": userNotes, "tags": tags });
            }
            else {
                var tags_array = []
                tags_array.push(filertags)
                var userNotes = await getPostsFilterByTags(latitute, longitude, radius, tags_array)
                return res.render("home", { title: "Pied Piper", "notes": userNotes, "tags": tags });
            }
        }
        catch (e) {
            return res.json({ error: e })
        }
    }
    else {
        // Only if friends toggle is selected
        try {
            var friend_id_logged_user = req.session.userInfo.friendID
            const { friends } = await data.friends.get(friend_id_logged_user)
            if (friends.length == 0) {
                return res.render("home", { title: "Pied Piper", "notes": [], "tags": tags });
            }
            else {
                var friends_posts_user_ids = []
                for (let i = 0; i < friends.length; i++) {
                    if (friends[i].status == 1) {
                        friends_posts_user_ids.push(friends[i].friendID)
                    }
                }

                var userNotes = await getPostsFilter(latitute, longitude, radius, friends_posts_user_ids)
                return res.render("home", { title: "Pied Piper", "notes": userNotes, "tags": tags });
            }
        }
        catch (e) {
            return res.json({ error: e })
        }

    }
    return res.redirect('/home')
})


module.exports = router