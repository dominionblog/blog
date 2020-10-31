let express = require("express");
let router = express.Router();
let passport = require('passport')
let User = require("../models/user")
let authenticator = require("../middleware/authenticator");

router.get("/logout", function(req, res) {
    req.logout();
    res.status(200);
    res.end()
})

router.post("/login", passport.authenticate('local'), (req, res) => {
    res.status(200);
    res.end()
})

router.post("/register", (req, res) => {
    User.register(new User({username: req.body.username, admin: false}), req.body.password).then(createdUser=> {
        console.log(createdUser)
    }).catch(err => {
        console.log(err);
    })
    res.end();
})
/**
 * Change the password for the currently logged
 * in user
 */
router.put("/pass/change", authenticator.admin, async (req, res) => {
    try {
        await req.user.changePassword(req.body.oldPassword,req.body.newPassword);
        res.status(200);
        return res.end();
    } catch(err) {
        res.status(500);
        res.end();
        throw err;
    }
})

router.get("/isloggedin", authenticator.general, (req, res) => {
    res.status(200);
    res.end();
})

module.exports = router;