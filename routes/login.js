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

module.exports = router