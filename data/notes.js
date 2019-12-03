const mongoCollections = require("../config/mongoCollections");
const notesData = mongoCollections.notes;
const geolib = require('geolib');

const createNotes = async function createNotes(userID, title, content, location, latitute, longitude) {
    var locationName;
    if (!userID) throw "No user provided.";
    if (!title) throw "No title provided.";
    if (!content) throw "No content provided.";
    if (!location) {
        locationName = "Stevens Institute of Technology";
    }
    if (!latitute || !longitude) {
        latitute = 44.5235792;
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
        latitude: latitute,
        note_createdAt: dateTime
    }

    const insertInfo = await notesCollection.insertOne(noteInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";
}

const findNotes = async function findNote(latitute, longitude, radius) {

    if (!latitute || !longitude) {
        latitute = 44.5235792;
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
        addNote = geolib.isPointWithinRadius({ latitude: noteLat, longitude: noteLong }, { latitude: latitute, longitude: longitude },
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
module.exports = {
    createNotes,
    findNotes,
    getAllNotes
}