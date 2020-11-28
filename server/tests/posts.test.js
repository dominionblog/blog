const { expect } = require("chai");
const chai = require("chai");
const chaiHTTP = require("chai-http");
chai.use(chaiHTTP);
const app = require("../app")
const mongoose = require('mongoose')

agent = chai.request.agent(app).keepOpen();

const Post = require("../models/post")
const Tags = require("../models/tag")

describe("Handling post logic", function() {
    before("Empty the posts database", function(done) {
        mongoose.connection.db.dropCollection("posts").then(() => {
            done()
        }).catch(err => {
            if (err.code == 26) {
                // Collection does not exist.
                return done();
            }
            throw err;
        })
    }) 
    before("Log the user in", function(done) {
        agent.post("/auth/login")
        .type('form')
        .send({
            'username':'admin',
            'password':'admin'
        })
        .end((err, res) => {
            if (err) throw err;
            expect(res).to.have.status(200);
            done();
        })
    })
    it("Should create a new post", function(done) {
        agent.post("/posts/new")
        .type("form")
        .send({
            'title': 'new post',
            'md': '# First post \n Welcome to my first post on this blog!',
            'resume': 'A summary of the first blog post 00001',
            tags: ['intro','welcome','new','test']
        }).end((err, res) => {
            if (err) throw err;
            expect(res).to.have.status(200);
            done();
        })
    });
    it("Should try to create a new post and fail", function(done) {
        agent.post("/posts/new")
        .type("form")
        .send({
            title: 'new post',
            md: 'test'
        }).end((err, res) => {
            if (err) throw err;
            expect(res).to.have.status(400); 
            done();
        })
    })
    /**
     * Gets all posts for the user that is currently
     * logged in.
     */
    it("Should get all posts", function(done) {
        agent.get("/posts/all")
        .end(function(err, res) {
            if (err) throw err;
            expect(res).to.have.status(200);
            done();
        })
    })
    /**
     * Gets all posts and displays them for the viewer
     */
    it("Should display all posts", function(done) {
        agent.get("/posts/view")
        .end(function(err, res) {
            if (err) throw err;
            expect(res).to.have.status(200).and.to.be.json
            expect(res.body[0]).to.have.any.keys('title','resume','author','tags').
            and.to.not.have.all.keys('md','html')
            done();
        })
    });
    it("Should get a post", function(done) {
        Post.findOne().then(foundPost => {
            agent.get("/posts/view/all")
            .query({
                '_id':foundPost.get('id')
            })
            .end(function(err, res) {
                if (err) throw err;
                expect(res).to.be.json;
                expect(res.body).to.have.property('md');
                expect(res.body).to.have.property('html');
                expect(res.body).to.have.property('archived');
                expect(res.body).to.have.property('draft');
                done();
            })
        })
    });
    it("Should get a post with query", done => {
        Post.findOne().populate('author').then(foundPost => {
            agent.get("/posts/query")
            .query({
                title: foundPost.title,
                author: foundPost.author.name
            })
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                expect(Object.keys(res.body[0]).includes('title')).to.be.true
                done();
            })
        })
    });
    it("Should get a post with a tag", done => {
        Post.findOne().then(foundPost => {
            agent.get("/posts/query")
            .query({
                tags: {
                    $in: String(foundPost.tags[0]) // Cast the ObjectID to a String (will cause error otherwise)
                }
            })
            .end((err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                expect(res.body).to.have.length.gt(0);
                done();
            })
        }).catch(err => {
            done(err)
        })
    })
    
    it("Should edit a post", function(done) {
        let tags = ['intro','welcome','new','test','edited']
        Post.findOne().then(foundPost => {
            agent.put("/posts/edit")
            .type('form')
            .send({
                '_id': foundPost.get('id'),
                'title': 'new title',
                'md': '# Edited Post!',
                'resume': 'This post was edited',
                tags: tags
            }).end((err, res) => {
                if (err) throw err
                expect(res).to.have.status(200);
                Post.findById(foundPost.get('id')).then(foundPost => {
                    expect(foundPost.get('title')).to.have.string('new title')
                    expect(foundPost.get('md')).to.have.string('# Edited Post!')
                    expect(foundPost.get('resume')).to.have.string('This post was edited')
                    expect(foundPost.get('tags')).to.be.an('array')
                    Tags.findById(foundPost.get('tags')[0]).then(foundTag => {
                        expect(foundTag.get('name')).to.be.oneOf(tags);
                        done();
                    });
                }).catch(err => {
                    throw err;
                })
            })
        })
    })
    /**
     * Sets a post's archived status to true
     */
    it("Should archive a post", done => {
        Post.findOne().then(foundPost => {
            agent.put("/posts/archive")
            .type('form')
            .send({
                _id: foundPost.get('id')
            }).end((err, res) => {
                expect(res).to.have.status(200);
                Post.findById(foundPost.get('id')).then(foundPost => {
                    expect(foundPost.get("archived")).to.be.true;
                    done();
                }).catch(err => {throw err})
            })
        }).catch(err => {throw err})
    })
    it("Should unarchive a post", done => {
        Post.findOne().then(foundPost => {
            agent.put("/posts/unarchive")
            .type('form')
            .send({
                _id: foundPost.get('id')
            })
            .end((err, res) => {
                expect(res).to.have.status(200);
                Post.findById(foundPost.get('id')).then(foundPost => {
                    expect(foundPost.get('archived')).to.be.false;
                    done()
                }).catch(err => {throw err})
            })
        })
    })
    after(() => {
        agent.close()
    })
})