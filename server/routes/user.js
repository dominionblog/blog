const express = require('express');
let router = express.Router();
let User = require("../models/user")
let authenticator = require("../middleware/authenticator");
let showdown = require("showdown")
let converter = new showdown.Converter();

/**
 * Query of user to view
 */
router.get("/view", async (req, res) => {
    let user = await User.findById(req.query._id || req.query.id);
    res.send(user._doc);
    res.end();
});

router.get("/all", async (req, res) => {
    // Get all users
    let allUser = await User.find().lean();
    res.send(allUser);
})

/**
 * Creates a new user
 * @param {Boolean} isAdmin `true` means the app will take
 * the value of `req.body.admin` and put that as the admin.
 * `false` means that the app will simply set it to false.
 * @param {*} req 
 * @param {*} res 
 */
let createUser = async (isAdmin, req, res) => {
    try {
        await User.register({
        username: req.body.username, 
        name: req.body.name,
        admin: isAdmin & req.body.admin,
        email: req.body.email,
        bio: {
            md: req.body.bio,
            html: converter.makeHtml(req.bio)
        }
        }, req.body.password)
        return;
    } catch(err) {
        throw err
    }
}

/**
 * For an admin making a new account.
 * This route can make admin accounts
 */
router.post("/new", authenticator.admin, async (req, res) => {
    try {
        await createUser(true, req, res);
        res.status(200);
        res.end();
    } catch(err) {
        if (err.name == "UserExistsError") {
            // User already exists
            res.status(400)
            res.send({
                message:"A user with this name already exists"
            })
            return res.end();
        }
        if (err.name == 'MissingUsernameError') {
            // No username given
            res.status(400)
            return res.send({message:"A username must be supplied"})
        }
        if (err.name == 'MissingPasswordError') {
            // No password given
            res.status(400)
            return res.send({message: "A password must be supplied"})
        }
        if (err instanceof mongoose.Error.ValidationError) {
            // Failed validation (regex does not match)
            res.status(400)
            return res.send({message: "Validation failed. Please check input values and try again."})
        }
        res.status(500)
        res.end();
        throw err;
    }
})
/**
 * Edits the user
 * This is a special route that edits any user. It
 * can only be used by the admin.
 * DOES NOT CHANGE THE PASSWORD. Password changes
 * are special and must be changed seperately.
 */
router.put("/edit", authenticator.admin, async (req, res) => {
    try {
        // Server accepts _id or id because I have enough of this!
        await User.findByIdAndUpdate(req.body.id || req.body._id, {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            admin: req.body.admin,
            bio: {
                md: req.body.bio,
                html: converter.makeHtml(req.body.bio)
            }
        });
        res.status(200);
        res.end();
    }catch(err) {
        res.status(500)
        res.end();
        throw err;
    }
});
/**
 * Edits the user that is logged in.
 * Leaving blanks fields keeps them as-is.
 * DOES NOT AFFECT PASSWORD
 */
router.put("/self", async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user.get('id'), {
            username: req.body.username || req.user.get('username'),
            name: req.body.name || req.user.get('name'),
            bio: {
                md: req.body.bio || req.user.get('bio.md'),
                html: req.body.bio ? converter.makeHtml(req.body.bio) : req.user.get('bio.html')
            },
            email: req.body.email || req.user.get('email')
        });
        res.status(200);
        return res.end();
    } catch(err) {
        res.status(500);
        res.end();
        throw err;
    }
})

/**
 * For a guest user creating an account.
 * Does not make admin accounts
 * Will support things like commenting and
 * that shabang later.
 */
router.post("/register", async (req, res) => {
    try {
        await createUser(false, req, res);
        res.status(200);
        res.end();
    } catch(err) {
        throw err;
    }
})
/**
 * Gets the currently logged in user
 */
router.get("/me", authenticator.admin, async(req, res) => {
    try {
        res.send(req.user._doc);
        res.end();
    } catch(err) {
        res.status(500);
        res.end()
        throw err;
    }
});

module.exports = router;
