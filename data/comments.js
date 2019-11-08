const mongoCollections = require("../config/mongoCollections");
const commentsData = mongoCollections.comments;


const createComment = async function createComment(noteid, userid, description, commented_at) {
    if (!noteid) throw "No note Id provided."
    if (!userid) throw "No user id provided."
    if (!description || typeof description !== 'string') throw "No description provided."

    const commentsCollection = await commentsData();
    const dateTime = new Date().toLocaleString('en-US');
    const commentInfo = {
        noteID: noteid,
        userid: userid,
        description: description,
        commented_at: dateTime
    }

    const insertInfo = await commentsCollection.insertOne(commentInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";
}

module.exports = {
    createComment
}