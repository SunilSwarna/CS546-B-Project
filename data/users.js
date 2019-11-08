const mongoCollections = require("../config/mongoCollections");
const usersData = mongoCollections.users;
var validator = require("email-validator");
var passwordHash = require('password-hash');

function emailIsValid(email) {
    return validator.validate(email);
}



const createUser = async function createUser(sessionID, name, email, password) {
    if (!name || typeof name !== 'string') throw "Pleas enter valid name.";
    if (!email || !emailIsValid(email)) throw "Pleas enter valid email.";
    if (!password || typeof password !== 'string' || password.length < 5) throw "Please enter valid password.";
    if (!sessionID) throw "No session ID provided.";

    const usersCollection = await usersData();
    var hashedPassword = passwordHash.generate(password);
    const userFound = await usersCollection.find({ 'email': email }).toArray();
    if (userFound.length != 0) throw "User already exists.";
    const userInfo = {
        sessionID: sessionID,
        password: hashedPassword,
        name: name,
        email: email
    }

    const insertInfo = await usersCollection.insertOne(userInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";

}

module.exports = {
    createUser
}