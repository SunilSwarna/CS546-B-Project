const mongoCollections = require("../config/mongoCollections");
const friendsData = mongoCollections.friends;
var ObjectId = require('mongodb').ObjectId;
const usersData = mongoCollections.users;

const createFriend = async function createFreind(userID) {
    if (!userID) throw "No user id provided";

    const friendsCollection = await friendsData();

    const friendsInfo = {
        userID: userID,
        friends: []
    }

    const insertInfo = await friendsCollection.insertOne(friendsInfo);


    if (insertInfo.insertedCount === 0) throw "Could not add user";

    const friendId = insertInfo.insertedId.toString();

    await this.updateFriendID(userID, friendId);

    return true;
}

const searchName = async function searchName(name) {
    if (!name || typeof name !== 'string') throw "You must provide a valid string name";
    const usersCollection = await usersData();
    let regex = new RegExp([".*", name, ".*"].join(""), "i");
    const nameFound = await usersCollection.find({ $or: [{ firstName: regex }, { lastName: regex }] }).toArray();

    if (nameFound.length < 1) {
        return [];
    }

    return nameFound;
}
const updateFriendID = async function updateFriendID(userID, friendID) {
    if (!userID || typeof userID !== 'string' || !ObjectId.isValid(userID)) throw "You must provide a valid id.";
    if (!friendID) throw "Friend ID not created."

    const usersCollection = await usersData();
    var o_id = new ObjectId(userID);

    const updateInfo = await usersCollection.updateOne({ _id: o_id }, { $set: { friendID: friendID } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    return true;
}

const addFriend = async function addFriend(id, userID, friendID) {

    if (!id) throw "No id provided";
    if (!userID) throw "No friend id provided";
    if (!friendID) throw "No friend id provided";
   

    const friendsCollection = await friendsData();
    const usersCollection = await usersData();

    if (!friendID || typeof friendID !== 'string' || !ObjectId.isValid(friendID)) throw "You must provide a valid string id to search for";
    var o_f_id = new ObjectId(friendID);

    const userInfo = await usersCollection.findOne({ _id: o_f_id });
    if (!userInfo) throw "No user with that id";


    var o_id = new ObjectId(id);

    const friendInfo = {
        friendID: friendID,
        status: 2
    }

    const updateInfo = await friendsCollection.updateOne({ _id: o_id }, { $addToSet: { friends: friendInfo } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';


    var o_ff_id = new ObjectId(userInfo.friendID);
    const friendInfo1 = {
        friendID: userID,
        status: 0
    }

    const updateInfo1 = await friendsCollection.updateOne({ _id: o_ff_id }, { $addToSet: { friends: friendInfo1 } });

    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount) throw 'Update failed';

    return true;
}


const approveFriend = async function approveFriend(id, userID, friendID) {

    if (!id) throw "user id provided";
    if (!userID) throw "No friend id provided for the user";
    if (!friendID) throw "No user id provided for the friend";
   

    const friendsCollection = await friendsData();
    const usersCollection = await usersData();

    if (!friendID || typeof friendID !== 'string' || !ObjectId.isValid(friendID)) throw "You must provide a valid string id to search for";
    var o_f_id = new ObjectId(friendID);

    const userInfo = await usersCollection.findOne({ _id: o_f_id });
    if (userInfo.length == 0) throw "No user with that id";


    var o_id = new ObjectId(id);


    const updateInfo = await friendsCollection.updateOne({ _id: o_id, friends: { $elemMatch: { friendID: friendID } } }, { $set: { "friends.$.status": 1 } });

    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';


    var o_ff_id = new ObjectId(userInfo.friendID);

    const updateInfo1 = await friendsCollection.updateOne({ _id: o_ff_id, friends: { $elemMatch: { friendID: userID } } }, { $set: { "friends.$.status": 1 } });
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount) throw 'Update failed';

    return true;
}



const get = async function get(id) {

    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid string id to search for";
    var o_id = new ObjectId(id);
    const friendsCollection = await friendsData();

    const friendInfo = await friendsCollection.findOne({ _id: o_id });
    if (friendInfo === null) throw "No friend with that id";

    return friendInfo;
}


const removeFriend = async function removeFriend(id, userID, friendID) {
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) throw "You must provide a valid string id to search for";
    if (!userID || typeof userID !== 'string' || !ObjectId.isValid(userID)) throw "You must provide a valid string id to search for";
    if (!friendID || typeof friendID !== 'string' || !ObjectId.isValid(friendID)) throw "You must provide a valid string id to search for";

    const friendsCollection = await friendsData();
    var o_id = new ObjectId(id);
    const updateInfo = await friendsCollection.updateOne({ _id: o_id }, { $pull: { friends: { friendID: friendID.toString(), status: 0 } } });
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';

    const usersCollection = await usersData();

    var o_f_id = new ObjectId(friendID);

    const friendInfo = await usersCollection.findOne({ _id: o_f_id });
    var o_ff_id = new ObjectId(friendInfo.friendID);
    const updateInfo1 = await friendsCollection.updateOne({ _id: o_ff_id }, { $pull: { friends: { friendID: userID.toString(), status: 2 } } });
    if (!updateInfo1.matchedCount && !updateInfo1.modifiedCount) throw 'Update failed';

    return true;
}

module.exports = {
    createFriend,
    addFriend,
    updateFriendID,
    get,
    removeFriend,
    approveFriend,
    searchName
}