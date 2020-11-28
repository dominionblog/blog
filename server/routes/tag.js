const express = require('express')
let router = express.Router()

let Tags = require("../models/tag")

/**
 * Get all tags
 */
router.get('/all', async (req, res) => {
    let allTags = await Tags.find()
    res.send(allTags);
});

/**
 * Query by name
 */
router.get('/query/:mode', async (req, res) => {
    /**
     * :mode
     * /query/all returns an array
     * /query/one returns one items
     * /query/anythingelse returns nothing with status 400
     */
    let foundData;
    if (req.params.mode == 'all') {
        foundData = await Tags.find(req.params.query).lean();
        res.status(200);
    } else if (req.params.mode == 'one') {
        foundData = await Tags.findOne(req.params.query).lean();
        res.status(200);
    } else {
        foundData = null
        res.status(400);
    }
    res.send(foundData);
});
/**
 * Search by _id
 */
router.get("/:id", async (req, res) => {
    let foundData = await Tags.findById(req.params.id);
    res.send(foundData);
})

module.exports = router