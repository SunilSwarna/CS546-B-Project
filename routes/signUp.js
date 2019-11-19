const express = require('express');
const router = express.Router();

const data = require('../data')

const loginMiddleware = (req, res, next) => {
    console.log(req.originalUrl)
    next()
};

router.get('/', loginMiddleware, async (req, res) => {
    try {
        res.render("signup", {});
    }
    catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})


router.post('/', async (req, res) => {

    try {
        if (!req.body) return res.status(400).render("signup", { error: "Bad Request" });
        if (!req.body.fullName || !req.body.inputEmail || !req.body.password || !req.body.confirmPassword) {
            return res.status(400).render("signup", { error: "One of the fileds is missing" })
        }
        await data.users.createUser("123", req.body.fullName, "sample", req.body.inputEmail, req.body.password);
        res.cookie("userData", {"message":req.body.fullName+" is Successfully Signed up!"}); 
        return res.redirect("/login")
    }
    catch (e) {
        return res.status(400).render("signup", { error: e })
    }
    // res.redirect('/signup')
})
module.exports = router