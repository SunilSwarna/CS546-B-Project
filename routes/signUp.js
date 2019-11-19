const express = require('express');
const router = express.Router();

const loginMiddleware =(req, res, next) =>{
    console.log(req.originalUrl)
    next()
};

router.get('/', loginMiddleware, async (req, res) => {
    try 
    {
        res.render("signup", {});
    }
    catch(e) 
    {    
        res.status(404).json({"error": "Couldn't load page"});    
    }
})

module.exports = router