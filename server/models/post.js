let mongoose = require("mongoose");

let postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    md: {type: String, required: true},
    html: String,
    resume: {type: String, required: true},
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'},
    tags: [{type: mongoose.Schema.Types.ObjectId, ref:'tag'}],
    draft: {type: Boolean, default: false},
    archived: {type: Boolean, default: false}
}, {
    timestamps: true
});

module.exports = mongoose.model("post", postSchema)