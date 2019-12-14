const homeRoutes = require('./home')
const friendsRoutes = require("./friends");
const addPostRoutes = require("./addPost");
const singUpRoutes = require("./signUp");
const locationRoutes = require("./location")
const loginRoutes = require("./login")
const logoutRoutes = require("./logout")
const constructorMethod = app => {

    app.use("/", loginRoutes);
    app.use("/home", homeRoutes);
    app.use("/friends", friendsRoutes);
    app.use("/addPost", addPostRoutes);
    app.use("/signup", singUpRoutes);
    app.use("/location", locationRoutes);
    app.use("/logout", logoutRoutes);
    app.use("*", (req, res) => {
        res.status(404).render("errors",{ "error": "Please Enter a Valid URL" });
    });
};

module.exports = constructorMethod;