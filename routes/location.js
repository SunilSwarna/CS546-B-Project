const express = require('express');
const router = express.Router();


router.get('/', async(req, res) => {
    try {
        res.render("location", {});
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})

module.exports = router