const mongoCollections = require("../config/mongoCollections");
const notesData = mongoCollections.notes;

const createNotes = async function createNotes(userID, title, content) {
    if (!userID) throw "No user provided."
    if (!title) throw "No title provided."
    if (!content) throw "No content provided."

    const notesCollection = await notesData();
    const dateTime = new Date().toLocaleString('en-US');
    const noteInfo = {
        userID: userID,
        title: title,
        content: content,
        latitute: 0,
        longitute: 0,
        radius: 10,
        note_createdAt: dateTime
    }

    const insertInfo = await notesCollection.insertOne(noteInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";
}

const findNote = async function findNote(latitute, longitude, radius) {

}

const getAllNotes = async function getAllNotes() {
    const notesCollection = await notesData();

    const notesAll = await notesCollection.find({}).toArray();

    return notesAll.reverse();
}
module.exports = {
    createNotes,
    findNote,
    getAllNotes
}