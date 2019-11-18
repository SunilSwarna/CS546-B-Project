const homeRoutes = require('./home')
const friendsRoutes = require("./friends");
const addPostRoutes = require("./addPost");

const constructorMethod = app => {


    app.use("/", homeRoutes)
    app.use("/friends", friendsRoutes)
    app.use("/addPost", addPostRoutes)
    app.use("*", (req, res) => {
        res.status(404).json({ "error": "Please Enter a Valid URL" });
    });
};

module.exports = constructorMethod;