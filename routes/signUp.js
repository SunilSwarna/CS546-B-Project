const express = require('express');
const router = express.Router();

const data = require('../data')

const loginMiddleware = (req, res, next) => {
    console.log(req.originalUrl)
    next()
};

router.get('/', loginMiddleware, async(req, res) => {
    try {
        res.render("signup", { title: "Signup Page" });
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})


router.post('/', async(req, res) => {

    try {
        if (!req.body) return res.status(400).render("signup", { title: "Signup Page", error: "Bad Request" });
        if (!req.body.firstName || !req.body.lastName || !req.body.inputEmail || !req.body.password || !req.body.confirmPassword) {
            return res.status(400).render("signup", { title: "Signup Page", error: "One of the fileds is missing" })
        }
        if (req.body.password != req.body.confirmPassword) {
            return res.status(400).render("signup", { title: "Signup Page", error: "Passwords do not match!" })
        }
        await data.users.createUser(req.body.firstName, req.body.lastName, req.body.inputEmail.toLowerCase(), req.body.password);
        res.cookie("userData", { "message": req.body.firstName + " is Successfully Signed up!" });
        return res.redirect("/");
    } catch (e) {
        return res.status(404).render("signup", { title: "Signup Page", error: e })
    }
    // res.redirect('/signup')
})
module.exports = router