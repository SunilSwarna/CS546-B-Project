const express = require('express');
const router = express.Router();

const loginMiddleware =(req, res, next) =>{
    req.loginMessage = undefined
    console.log(req.originalUrl)
    if(req.cookies.userData){
        req.loginMessage = req.cookies.userData.message
        res.clearCookie("userData")
    }
    next()
};

router.get('/', loginMiddleware, async (req, res) => {
    try 
    {   
        if(req.loginMessage) return res.render("login", {"message": req.loginMessage});
        else return res.render("login");
    }
    catch(e) 
    {    
        res.status(404).json({"error": "Couldn't load page"});    
    }
})

router.post('/', async (req, res) => {
    try 
    {   
        if (!req.body) return res.status(400).render("login", { error: "Bad Request" });
        if (!req.body.inputEmail || !req.body.password ) {
            return res.status(400).render("login", { error: "One of the fileds is missing" })
        }
    }
    catch(e) 
    {    
        return res.status(404).render("signup", { error: e })    
    }
})

module.exports = router