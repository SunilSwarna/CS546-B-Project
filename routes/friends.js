const express = require('express');
const router = express.Router();
const data = require("../data");
const notes = data.notes;

router.get('/', async(req, res) => {
    try {
        var frds = [{"name": "sunil", "id":1},{"name": "sks", "id":2},{"name": "kmr", "id":3}]
        var showFrds = frds.length>0 ? true:false
        res.render("friends", {frds, showFrds});
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})

router.post('/search', async(req, res) => {
    try {
        var name = req.body.name
        console.log(name)
        // validate if body.name is there if not throw error
        var arr = [{"name": "Sunil Kumar", "id":1},{"name": "Kunj Desai", "id":2},{"name": "Nihit Patel", "id":3}]
        res.json({name, arr});
    } catch (e) {
        res.status(404).json({ "error": "Couldn't load page" });
    }
})


router.post("/add/:id", async(req, res) => {
        // validate if body.name is there if not throw error
    console.log(req.params.id);
    res.json({id : req.params.id });
  });
module.exports = router