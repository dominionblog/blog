User = require("../models/user")

module.exports = {
    general: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401);
        res.end();
    },
    admin: (req, res, next) => {
        if (req.isAuthenticated()) {
            User.findById(req.user._doc._id).then(foundUser => {
                if (foundUser.get("admin")) {
                    return next();
                } else {
                    res.status(401);
                    res.end();
                }
            }).catch(err => {
                if (err) throw err;
            })
        } else {
            /**
             * The else statement must be here, otherwise, the code will
             * run this and will not wait for the promise to finish before ending.
             */
            res.status(401);
            res.end();
        }
    }
}