const mongoCollections = require("../config/mongoCollections");
const notesData = mongoCollections.notes;
const commentsData = mongoCollections.comments;
const geolib = require('geolib');
var ObjectId = require('mongodb').ObjectId;

const createNotes = async function createNotes(userID, title, content, radius, latitude, longitude ,tags) {

    if (!userID) throw "No user provided.";
    if (!title) throw "No title provided.";
    if (!content) throw "No content provided.";
    if (!radius) {
        radius = 5000
    }
    if (!latitude || !longitude) {
        latitude = 44.5235792;
        longitude = -89.574563;
    }


    const notesCollection = await notesData();
    const dateTime = new Date().toDateString('en-US');
    const noteInfo = {
        userID: userID,
        title: title,
        content: content,
        radius: parseInt(radius),
        longitude: longitude,
        latitude: latitude,
        note_createdAt: dateTime,
        tags: tags,
        comments: []
    }

    const insertInfo = await notesCollection.insertOne(noteInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";
}

const findNotes = async function findNote(latitude, longitude, radius) {

    if (!latitude || !longitude) {
        latitude = 40.745094;
        longitute = -74.024255;
    }
    if (!radius) {
        radius = 5000;
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
        radius = allNotes[i].radius;
        addNote = geolib.isPointWithinRadius({ latitude: parseFloat(noteLat), longitude: parseFloat(noteLong) }, { latitude: parseFloat(latitude), longitude: parseFloat(longitude) },
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
    const allNotes = await this.getAllNotes();
    var notesByUser = [];
    for (var i = 0; i < allNotes.length; i++) {
        if (allNotes[i].userID == id) {
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
const updateNote = async function updateNote(id, title, content, radius,tags) {

   console.log(String(id))
    const note = await this.getNoteById(String(id));
    const notesCollection = await notesData();
    if (!title) {
        title = note.title;
    }
    if (!content) {
        content = note.content;
    }
   
  
    if (!radius) {
        radius = note.radius;
    }

    let updateInfo = {
        userID: note.userID,
        title: title,
        content: content,
        radius: parseInt(radius),
        longitude: note.longitude,
        latitude: note.latitude,
        note_createdAt: note.note_createdAt,
        tags: tags,
        comments: note.comments
    }

    const updatedInfo = await notesCollection.replaceOne({ _id: note._id },
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
    const updateInfo = await notesCollection.updateOne({ _id: o_id }, { $addToSet: { comments: {"commentID":String(commentID) }  } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return await this.getNoteById(String(noteID));
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