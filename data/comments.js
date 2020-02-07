const mongoCollections = require("../config/mongoCollections");
const commentsData = mongoCollections.comments;
const usersData = mongoCollections.users;

const notesData = require("./notes");
var ObjectId = require('mongodb').ObjectId;

const createComment = async function createComment(noteid, userid, description) {
    if (!noteid) throw "No note Id provided."
    if (!userid) throw "No user id provided."
    if (!description || typeof description !== 'string') throw "No description provided."

    const commentsCollection = await commentsData();
    const dateTime = new Date().toDateString('en-US');
    const commentInfo = {
        noteID: noteid,
        userid: userid,
        description: description,
        commented_at: dateTime
    }

    const insertInfo = await commentsCollection.insertOne(commentInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add comment.";

    const id = insertInfo.insertedId.toString();

    const addedComment = await this.getCommentByID(id);

    await notesData.addCommentToNote(addedComment.noteID, addedComment._id);

    return addedComment;

}

const getCommentByID = async function getCommentByID(id) {
    const commentsCollection = await commentsData();

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid post id.";

    var o_id = new ObjectId(id);

    const commentOne = await commentsCollection.findOne({ _id: o_id });

    if (commentOne === null) throw "No comment found";

    return commentOne;
}

const removeComment = async function removeComment(id) {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid string id to remove for";

    var o_id = new ObjectId(id);
    const deletedComment = this.getCommentByID(id);
    const commentsCollection = await commentsData();

    await notesData.removeCommentFromNote(deletedComment.userid, deletedComment._id);

    const deleteInfo = await commentsCollection.findOneAndDelete({ _id: o_id });

    if (deleteInfo.value === null) {
        throw `Could not delete comment.`;
    }

    return true;
}

const getUserNamebyComment = async function  getUserNamebyComment(comment_id){
    const commentsCollection = await commentsData();

    if (!comment_id || typeof comment_id !== 'string' || !ObjectId.isValid(comment_id)) throw "You must provide a valid comment id.";

    var c_id = new ObjectId(comment_id);

    const commentOne = await commentsCollection.findOne({ _id: c_id });

    if (commentOne === null) throw "No comment found";

    var u_id = new ObjectId(commentOne.userid);
    const usersCollection = await usersData();

    const userInfo = await usersCollection.findOne({ _id: u_id });
    if (userInfo == null) throw "No user with that id";
    return {userInfo, commentOne};
}

module.exports = {
    createComment,
    getCommentByID,
    removeComment,
    getUserNamebyComment
}