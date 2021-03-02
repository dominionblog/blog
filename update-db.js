const mongoose = require('mongoose');
const mongodb = require('mongodb')
const Posts = require("./server/models/post")
const Tag = require("./server/models/tag")

// let MONGODB_URI = "mongodb+srv://admin:UKxJDy0iTaO1nofv@main.fl4tu.mongodb.net/test?authSource=admin&replicaSet=atlas-yjianx-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true"
let MONGODB_URI = "mongodb://localhost"

let MongoClient = mongodb.MongoClient;
MongoClient.connect(MONGODB_URI).then(async db => {
    let dbo = db.db("test-db")
    let allPosts = await dbo.collection("posts").find({});
    allPosts.forEach(async post => {
        let newTags = [];
        post.tags.forEach(async tag => {
            // Check if the tag is an ObjectId
            if (tag instanceof mongoose.Types.ObjectId) {
                // It is an Object id
                // Check if a tag exists
                let foundTag = await dbo.collection("tags").find({_id: tag})
                if (!foundTag) {
                    // The ID is invalid. Something's wrong
                    console.error("invalid Tag ID found")
                }
            } else {
                // Check if a tag exists
                let tagDoc = await dbo.collection("tags").find({name: tag});
                // If tag does not exist, create a new one
                if (!tagDoc) {
                    let res = await dbo.collection("tags").insertOne({
                        name: tag,
                        description: ''
                    });
                    newTags.push(res)
                }
                // If tag does exist, use it's id
                newTags.push(tagDoc._id);   
            }
        });
        await dbo.collection('posts').updateOne({_id: post._id},{$set: {
            tags: newTags
        }})
    })
}).catch(err => {
    throw err;
});

// mongoose.connect(MONGODB_URI).then(res => {
//     console.log('connected!');
//     let newTags = [];
//     (async () => {
//         let allPosts = await Posts.find({_id: "5fc1be210b4452a8a095446c"});
//         allPosts.forEach(post => {
//             post.tags.forEach(async tag => {
//                 // Check if the tag is an ObjectId
//                 if (tag instanceof mongoose.Mongoose.Types.ObjectId) {
//                     // It is an Object id
//                     // Check if a tag exists
//                     let foundTag = await Tag.findById(tag)
//                     if (!foundTag) {
//                         // The ID is invalid. Something's wrong
//                         console.error("invalid Tag ID found")
//                     }
//                 } else {
//                     // Get name
//                     let tagName = post.get('tag')
//                     // Check if a tag exists
//                     let tagDoc = await Tag.findOne({name: tagName});
//                     // If tag does not exist, create a new one
//                     if (!tagDoc) {
//                         let createdTag = await Tag.create({
//                             name: tagName
//                         })
//                         newTags.push(createdTag.get('id'))
//                     }
//                     // If tag does exist, use it's id
//                     newTags.push(tagDoc.get('id'));   
//                 }
//             });
//         })
//     })()
// }).catch(err => {
//     throw err;
// });