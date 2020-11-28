let express = require('express');
let router = express.Router();
let Post = require("../models/post.js");
let Users = require("../models/user")
let showdown = require("showdown");
converter = new showdown.Converter();
const mongoose = require('mongoose');
let authenticator = require("../middleware/authenticator");
const { route } = require('./auth.js');

let Tags = require("../models/tag")

/**
 * Gets all posts for the user that is currently logged in.
 */
router.get("/all", authenticator.admin, async (req, res) => {
    let posts = await Post.find({author: req.user.get("_id")}).lean();
    res.status(200);
    res.send(posts)
});

/**
 * Add tags to the registry. If tags have already been added, they will be ignored 
 * @param {[String]} givenTags -- Array of strings of names of tags to be added
 * @returns {[ObjectId]} -- Array of the ObjectIds of the given tags
 */
let updateTags = async (givenTags) => {
    let existingTags = await Tags.find();
    existingTagNames = existingTags.map(tag => {
        return tag.name
    })
    let addTags = [];
    givenTags.forEach(tag => {
        /**
         * Only insert tags that have not yet been inserted
         */
        if (!existingTagNames.includes(tag)) {
            addTags.push(
                {
                    name: tag.toLowerCase(),
                    descripion: ''
                }
            )
        }
    });
    let createdTags = await Tags.insertMany(addTags);
    let createdTagIds = createdTags.map(tag => {
        return tag.get('id')
    })
    /* Convert the tags to their ids */
    tagIds = [];
    existingTags.forEach(tag => {
        if (givenTags.includes(tag.get('name'))) {
            tagIds.push(tag.get('id'))
        }
    });
    allTags = createdTagIds.concat(tagIds); // Make sure all tags are given
    return allTags;
}

router.post("/new", authenticator.admin, async (req, res) => {
    /* Make sure all fields are filled*/
    let x = req.body;
    /* NOTE: The author is determined by the computer */
    if ( (!x.title) || (!x.md) || (!x.tags) || x.tags == []) {
        res.status(400);
        return res.end();
    }
    let returnedIds = await updateTags(req.body.tags)
    // NOTE: I do not know why the linter does not like the await. It IS needed.
    /* Convert te tags to tagIds */
    Post.create({
        title: req.body.title,
        md: req.body.md,
        html: converter.makeHtml(req.body.md),
        resume: req.body.resume,
        tags: returnedIds,
        author: req.user.get("id")
    }).then(async newPost => {
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
    .populate('author tags').lean();
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
        // Update the Tag Registry
        let createdTags = await updateTags(req.body.tags)
        // Update the post
        post.set("title",req.body.title);
        post.set("md",req.body.md);
        post.set('resume',req.body.resume);
        post.set('tags',createdTags);
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
        let posts = await Post.find({archived: false}).populate('author tags').select("title tags resume author createdAt updatedAt").lean();
        res.send(posts);
        res.end();
    } catch(err) {
        res.status(500);
        res.end();
        throw err;
    }
    
});

router.get("/query", async (req, res) => {
    if (req.query.author) {
        try {
            mongoose.Types.ObjectId(req.query.author)
        } catch(err) {
            /* An author name was given instead of an autor _id */
            let foundAuthor = (await Users.findOne({name: req.query.author})).get('id');
            req.query.author = foundAuthor 
        }
    }
    let foundPosts = await Post.find(req.query).lean();
    res.send(foundPosts);
});

router.get("/search/tag/:tagId", async (req, res) => {
    let foundPosts = await Post.find({tags: {
        $in: req.params.tagId
    }}).populate('author').populate('tags').lean();
    res.send(foundPosts)
})

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