let { expect } = require('chai');
let chai = require('chai');
let chaiHTTP = require('chai-http');
let chaiAsPromised = require("chai-as-promised")
let app = require('../app');
const { create } = require('../models/post');
let Post = require('../models/post');
let Users = require('../models/user')
let mongoose = require('mongoose')
chai.use(chaiHTTP);
chai.use(chaiAsPromised)

let agent = chai.request.agent(app);

/**
 * Makes sure 
 */
describe("Makes sure that the user cannot access data without proper authentication", () => {
    before("Empty the database", done => {
        /**
         * Removed, as making new posts from here is very annoying!
         */
        done()
    })
    it("Tries to make a new post", done => {
        agent.post("/posts/new")
        .type('form')
        .send({
            'title': 'not-posted',
            'md': '# First post \n Welcome to my first post on this blog!',
            'resume': 'A summary of the first blog post',
            'tags': ['intro','welcome','new','test']
        })
        .end((err, res) => {
            expect(res).to.have.status(401);
            Post.find({title:'not-posted'}).then(foundPost => {
                expect(foundPost).to.be.an('array').that.is.empty;
                done();
            })
        })
    });
    it("Tries to edit a post", async () => {
        let post = await Post.findOne(); // Find a post
        agent.put("/posts/edit")
        .type('form')
        .send({
            '_id': post.get('id'),
            'title': 'edited'
        })
        .end((err, res) => {
            expect(res).to.have.status(401);
            expect(Post.findById(post.get('id'))).to.eventually.not.have.string("edited");
        })
    })
    it("tried to make a new user", done => {
        expect(agent.post("/users/new").type('form').send({
            username: 'test-user-security',
            password: 'test-user-security',
            name: 'Test User',
            email: 'test@test.co',
            admin: false,
            bio: 'Test user'
        })).to.eventually.have.status(401).notify(done)
    })
})