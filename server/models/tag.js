const mongoose = require('mongoose')

let tagSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: String
})

module.exports = mongoose.model('tag',tagSchema)