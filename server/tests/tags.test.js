const chai = require('chai')
const {expect} = chai
const chaiHTTP = require('chai-http')
const chaiAsPromised = require('chai-as-promised')
const app = require('../app')
const mongoose = require("mongoose");
require("dotenv").config();
app.use(chaiHTTP);
app.use(chaiAsPromised);
let agent = chai.request.agent(app).keepOpen(); 

let Tags = require('../models/tag');

describe("Creating posts and tags", () => {
    let tags = ['intro','welcome','new','test'];
    before("log in", done => {
        agent.post("/auth/login")
        .type('form')
        .send({
            username: process.env.ADMINNAME,
            password: process.env.ADMINPASS
        }).end((err, res) => {
            if (err) done(err)
            expect(res).to.have.status(200)
            done()
        })
    });
    before("delete all posts", done => {
        mongoose.connection.db.dropCollection('posts').then(() => {
            done()
        }).catch(err => {
            if (err.code == 26) {
                done() /* The collection does not exist */
            } else {
                done(err)
            }
        })
    });
    before("delete all tags", done => {
        mongoose.connection.db.dropCollection('tags').then(() => {
            done()
        }).catch(err => {
            if (err.code == 26) {
                done() /* Collection already exists */
            } else {
                done(err)
            }
        })
    })
    it("Should create a post and update tag registry", done => {
        agent.post("/posts/new")
        .type('form')
        .send({
            'title': 'new tag test',
            'md': '# First post \n Welcome to my first post on this blog!',
            'resume': 'A summary of the first blog post',
            tags: tags
        }).end((err, res) => {
            if (err) done(err)
            expect(res).to.have.status(200);
            agent.get('/tags/all').end( (err, res) => {
                if (err) done(err);
                expect(res).to.have.status(200);
                let returnedTags = res.body.map(tag => {
                    return tag.name
                })
                expect(returnedTags).to.have.members(tags)
                done();
            })
        })
    });
    it("Should not add any new tags", done => {
        agent.post("/posts/new")
        .type('form')
        .send({
            title: 'should not add any tags',
            'md': '# First post \n Welcome to my first post on this blog!',
            'resume': 'A summary of the first blog post',
            tags: tags
        }).end((err, res) => {
            if (err) done(err);
            expect(res).to.have.status(200);
            agent.get("/tags/all").end((err, res) => {
                if (err) done(err);
                let returnedTags = res.body.map(tag => tag.name)
                expect(res).to.have.status(200)
                expect(returnedTags).to.have.lengthOf(4)
                .and.to.have.members(tags)
                done();
            })
        })
    });
    it("Should find a tag with a given id using query", async () => {
        let tag = await Tags.findOne() // I just want a tag
        expect(tag).to.be.ok;
        let res = await agent.get("/tags/query/one")
        .query({
            "_id":tag.get("id")
        });
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object')
        .and.to.have.any.keys('name','descritpion','_id')
    });
    it("Should find a tag with a given id using /tag/:id", async () => {
        let tag = await Tags.findOne();
        expect(tag).to.be.ok;
        let res = await agent.get("/tags/" + tag.get("id"))
        expect(res).to.have.status(200)
        .and.to.be.an('object')
        expect(res.body).to.have.any.keys('name','descritpion','_id')
    })
})