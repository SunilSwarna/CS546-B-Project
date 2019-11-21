const express = require('express');
const router = express.Router();
const data = require('../data')

const loginMiddleware = (req, res, next) => {
    req.loginMessage = undefined
    if (req.cookies.userData) {
        req.loginMessage = req.cookies.userData.message
        res.clearCookie("userData")
    }
    next()
};

router.get('/', loginMiddleware, async(req, res) => {
    try {
        if (req.loginMessage) return res.render("login", { title: "Login Page", "message": req.loginMessage });
        else return res.render("login", { title: "Login Page" });
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})

router.post('/', async(req, res) => {
    try {
        req.session.logged = false;
        if (!req.body) return res.status(400).render("login", { error: "Bad Request" });
        if (!req.body.inputEmail || !req.body.password) {
            return res.status(400).render("login", { error: "One of the fileds is missing" })
        }
        const foundUser = await data.users.checkUser(req.body.inputEmail, req.body.password);
        if (foundUser) {
            req.session.logged = true;
            res.redirect("/home");
        } else {
            throw "Email or password not correct.";
        }
    } catch (e) {
        return res.status(404).render("login", { error: e })
    }
})

module.exports = router