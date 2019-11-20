const mongoCollections = require("../config/mongoCollections");
const usersData = mongoCollections.users;
var validator = require("email-validator");
var passwordHash = require('password-hash');

function emailIsValid(email) {
    return validator.validate(email);
}



const createUser = async function createUser(sessionID, firstName, lastName, email, password) {
    if (!firstName || typeof firstName !== 'string') throw "Pleas enter valid first name.";
    if (!lastName || typeof lastName !== 'string') throw "Pleas enter valid first name.";
    if (!email || !emailIsValid(email)) throw "Pleas enter valid email.";
    if (!password || typeof password !== 'string' || password < 5) throw "Please enter valid password.";
    if (!sessionID) throw "No session ID provided.";

    const usersCollection = await usersData();
    var hashedPassword = passwordHash.generate(password);
    const userFound = await usersCollection.find({ 'email': email.toLowerCase()}).toArray();
    if (userFound.length != 0) throw "User already exists.";
    const userInfo = {
        sessionID: sessionID,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase()
    }

    const insertInfo = await usersCollection.insertOne(userInfo);

    if (insertInfo.insertedCount === 0) throw "Could not add user";

}

const getAll = async function getAll() {
    const usersCollection = await usersData();

    const userAll = await usersCollection.find({}).toArray();

    const resultArr = [];
    for (element of userAll) {
        resultArr.push(await this.get(element._id.toString()));
    }
    return resultArr;
}




module.exports = {
    createUser,
    getAll
}