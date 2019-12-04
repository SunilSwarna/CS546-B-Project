const mongoCollections = require("../config/mongoCollections");
const usersData = mongoCollections.users;
const friendsData = require("./friends");
var validator = require("email-validator");
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);


function emailIsValid(email) {
    return validator.validate(email);
}



const createUser = async function createUser(firstName, lastName, email, password) {
    if (!firstName || typeof firstName !== 'string') throw "Pleas enter valid first name.";
    if (!lastName || typeof lastName !== 'string') throw "Pleas enter valid first name.";
    if (!email || !emailIsValid(email)) throw "Pleas enter valid email.";
    if (!password || typeof password !== 'string' || password < 5) throw "Please enter valid password.";

    const usersCollection = await usersData();
    var hashedPassword = bcrypt.hashSync(password, salt);
    const userFound = await usersCollection.find({ 'email': email.toLowerCase() }).toArray();
    if (userFound.length != 0) throw "User already exists.";

    const userInfo = {
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        friendID: null
    }

    const insertInfo = await usersCollection.insertOne(userInfo);

    const id = insertInfo.insertedId.toString();

    await friendsData.createFriend(id);
    if (insertInfo.insertedCount === 0) throw "Could not add user";

    return id;
}

const getAll = async function getAll() {
    const usersCollection = await usersData();

    const userAll = await usersCollection.find({}).toArray();
    return userAll;
}


const checkUser = async function checkUser(email, password) {
    if (!email || !emailIsValid(email)) throw 'Invalid email';
    if (!password || password < 5) throw 'Password not provided correctly';

    const allUserData = await this.getAll();
    let checkValidUser = false;
    for (var i = 0; i < allUserData.length; i++) {
        if (allUserData[i].email === email) {
            var checkPassword = await bcrypt.compareSync(password, allUserData[i].password);
            if (checkPassword) {
                checkValidUser = true;
            }
        }
    }
    return checkValidUser;
}


const getUserByID = async function getUserByID(id) {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid string id to search for";
    var o_id = new ObjectId(id);
    const usersCollection = await usersData();

    const userInfo = await usersCollection.findOne({ _id: o_id }).toArray();
    if (userInfo.length == 0) throw "No user with that id";

    return userInfo;
}

module.exports = {
    createUser,
    getAll,
    checkUser,
    getUserByID
}