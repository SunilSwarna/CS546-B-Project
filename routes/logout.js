const express = require('express');
const router = express.Router();

const logoutMiddleware = (req, res, next) => {
    if (req.session.logged == false) {
        res.status(403).render("login", { title: "Login Page", error: "Access denied." });
    } else {
        res.locals.testName =  undefined
        next();
    }
}

router.get('/', logoutMiddleware, async(req, res) => {
    res.clearCookie("AuthCookie");
    req.session.logged = false;
    res.redirect("/");
    
});

module.exports = router;