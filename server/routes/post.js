let express = require('express');
let router = express.Router();
let Post = require("../models/post.js");
let showdown = require("showdown");
converter = new showdown.Converter();
const mongoose = require('mongoose');
let authenticator = require("../middleware/authenticator");
const { route } = require('./auth.js');

/**
 * Gets all posts for the user that is currently logged in.
 */
router.get("/all", authenticator.admin, async (req, res) => {
    let posts = await Post.find({author: req.user.get("_id")}).lean();
    res.status(200);
    res.send(posts)
});

router.post("/new", authenticator.admin, async (req, res) => {
    Post.create({
        title: req.body.title,
        md: req.body.md,
        html: converter.makeHtml(req.body.md),
        resume: req.body.resume,
        tags: req.body.tags,
        author: req.user.get("id")
    }).then(newPost => {
        res.status(200);
        res.end();
    }).catch(err => {
        if (err instanceof mongoose.Error.ValidationError) {
            res.status(400);
            return res.end();
        }
        throw err;
    })
})

/**
 * Get the post and the md.
 */
router.get("/view/all", async (req, res) => {
    let post = await Post.findById(mongoose.Types.ObjectId(req.query._id))
    .populate('author').lean();
    if (!post) {
        res.status(400);
        return res.end();
    }
    res.send(post);
    res.end();
});

/**
 * Get the post and edit it
 */
router.put("/edit", async (req, res) => {
    try {
        let post = await Post.findById(req.body._id);
        // Authenticate the user
        if ((!req.user) || (!req.user._doc._id == post.author)) {
            res.status(401);
            return res.end();
        }
        // Update the post
        post.set("title",req.body.title);
        post.set("md",req.body.md);
        post.set('resume',req.body.resume);
        post.set('tags',req.body.tags);
        // Generate the HTML
        post.set("html", converter.makeHtml(post.get('md')));
        await post.save();
        res.status(200);
        res.end();
    } catch(err) {
        throw err
    }
})

router.get("/view", async (req, res) => {
    try {
        let posts = await Post.find({archived: false}).select("title tags resume author createdAt updatedAt").lean();
        res.send(posts);
        res.end();
    } catch(err) {
        res.status(500);
        res.end();
        throw err;
    }
    
});

async function setArchived(status, req, res) {
    /**
     * Make sure the post belongs to the current user
     */
    let post = await Post.findById(req.body._id);
    if ((!req.user) || (!post.get("author") == req.user.get('id'))) {
        res.status(401);
        return res.end();
    }
    post.set("archived",status);
    await post.save();
    return;
}

router.put("/archive", async (req, res) => {
    try {
        await setArchived(true, req, res);
        res.status(200);
        res.end();
    } catch(err) {
        throw err;
    }
})
router.put("/unarchive", async (req, res) => {
    try {
        await setArchived(false, req, res);
        res.status(200);
        res.end();
    } catch(err) {
        throw err;
    }
})

router.get("/test", (req, res) => {
    res.status(200);
    res.end();
})

module.exports = router;