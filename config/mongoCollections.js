const dbConnection = require("./mongoConnection");

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = collection => {
<<<<<<< Updated upstream
    let _col = undefined;

    return async() => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
=======
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
>>>>>>> Stashed changes
};

/* Now, you can list your collections here: */
module.exports = {
<<<<<<< Updated upstream
    users: getCollectionFn("users"),
    comments: getCollectionFn("comments"),
    tags: getCollectionFn("tags"),
    notes: getCollectionFn("notes"),
    friends: getCollectionFn("friends")
=======
  posts: getCollectionFn("posts"),
  animals: getCollectionFn("animals")
>>>>>>> Stashed changes
};