mongoose = require("mongoose");
localMongoose = require('passport-local-mongoose')

userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: String,
    name: {type: String, required: true},
    email: {type: String, required: true},
    admin: {type: Boolean, default: false},
    bio: {
        md: {type: String, required: true},
        // Generated by the computer
        html: String
    }
});

userSchema.path('email').validate(val => {
    let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/
    let lowerCaseEmail = val.toLowerCase();
    return lowerCaseEmail.match(emailRegex);
}, 'Invalid email')

userSchema.plugin(localMongoose)

module.exports = mongoose.model('user', userSchema)