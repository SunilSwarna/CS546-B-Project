const mongoCollections = require("../config/mongoCollections");
const notesData = mongoCollections.notes;
const commentsData = mongoCollections.comments;
const geolib = require('geolib');
var ObjectId = require('mongodb').ObjectId;

const createNotes = async function createNotes(userID, title, content, location, latitude, longitude) {
    var locationName;
    if (!userID) throw "No user provided.";
    if (!title) throw "No title provided.";
    if (!content) throw "No content provided.";
    if (!location) {
        locationName = "Stevens Institute of Technology";
    }
    if (!latitude || !longitude) {
        latitude = 44.5235792;
        longitude = -89.574563;
    }


    const notesCollection = await notesData();
    const dateTime = new Date().toLocaleString('en-US');
    const noteInfo = {
        userID: userID,
        title: title,
        content: content,
        locationName: locationName,
        longitude: longitude,
        latitude: latitude,
        note_createdAt: dateTime,
        comments: []
    }

    const insertInfo = await notesCollection.insertOne(noteInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";
}

const findNotes = async function findNote(latitude, longitude, radius) {

    if (!latitude || !longitude) {
        latitude = 44.5235792;
        longitute = -89.574563;
    }
    if (!radius) {
        radius = 5;
    }
    const allNotes = await this.getAllNotes();
    var noteLong, noteLat;
    var currentNote;
    const allNotesArray = [];
    var addNote;

    for (var i = 0; i < allNotes.length; i++) {
        currentNote = allNotes[i];
        noteLong = allNotes[i].longitude;
        noteLat = allNotes[i].latitude;
        addNote = geolib.isPointWithinRadius({ latitude: noteLat, longitude: noteLong }, { latitude: latitude, longitude: longitude },
            radius
        );
        if (addNote) {
            allNotesArray.push(currentNote)
        }
    }

    return allNotesArray;
}

const getAllNotes = async function getAllNotes() {
    const notesCollection = await notesData();

    const notesAll = await notesCollection.find({}).toArray();

    return notesAll.reverse();
}

const findNotesByUserID = async function findNotesByUserID(id) {

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid post id.";

    const allNotes = this.getAllNotes();
    var notesByUser = [];
    for (var i = 0; i < allNotes.length; i++) {
        if (allNotes[i].userID === id) {
            notesByUser.push(allNotes[i]);
        }
    }

    return notesByUser;

}

const deleteNote = async function deleteNote(id) {

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid string id to remove for";
    const notesCollection = await notesData();
    var o_id = new ObjectId(id);
    const deleteInfo = await notesCollection.findOneAndDelete({ _id: o_id });
    if (deleteInfo.value === null) {
        throw `Could not delete with id of ${id}`;
    }
    return deleteInfo.value;
}

const getNoteById = async function getNoteById(id) {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid string id to remove for";
    const notesCollection = await notesData();
    const commentsCollection = await commentsData();
    var o_id = new ObjectId(id);
    const noteOne = await notesCollection.findOne({ _id: o_id });


    var comment_o_id = [],
        commentObjArr = [];
    var commentArr = noteOne.comments;

    commentArr.forEach(element => {
        comment_o_id.push(new ObjectId(element.commentID.toString()));
    });

    for (element of comment_o_id) {
        const commentOnNote = await commentsCollection.findOne({ _id: element });
        const commentObj = { "_id": commentOnNote._id, "Description": commentOnNote.description };
        commentObjArr.push(commentObj);
    }

    if (noteOne === null) throw "No note with that id";

    return noteOne;
}
const updateNote = async function updateNote(id, title, content, location, latitude, longitude) {
    const note = this.getNoteById(id);
    const notesCollection = await notesData();
    if (!title) {
        title = note.title;
    }
    if (!content) {
        content = note.content;
    }
    if (!location) {
        location = note.location;
    }
    if (!latitude || !longitude) {
        latitude = note.latitude;
        longitude = note.longitude;
    }

    let updateInfo = {
        userID: note.userID,
        title: title,
        content: content,
        location: location,
        latitude: latitude,
        longitude: longitude
    }

    const updatedInfo = await notesCollection.replaceOne({ _id: o_id },
        updateInfo
    );
    if (updatedInfo.modifiedCount === 0) {
        throw "could not update  successfully";
    }

    return await this.getNoteById(id);

}

const addCommentToNote = async function addCommentToNote(noteID, commentID) {
    const notesCollection = await notesData();
    var o_id = new ObjectId(noteID);
    const updateInfo = await notesCollection.updateOne({ _id: o_id }, { $addToSet: { comments: { commentID } } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getNoteById(noteID.toString());
}

const removeCommentFromNote = async function removeCommentFromNote(noteID, commentID) {
    const notesCollection = await notesData();
    const updateInfo = await notesCollection.updateOne({ _id: noteID }, { $pull: { comments: { commentID: commentID.toString() } } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getNoteById(noteID.toString());
}


module.exports = {
    createNotes,
    findNotes,
    getAllNotes,
    findNotesByUserID,
    deleteNote,
    getNoteById,
    updateNote,
    addCommentToNote,
    removeCommentFromNote
}