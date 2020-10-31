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
        mongoose.connection.db.dropCollection('posts').then(() => done()).catch(err => {
            if (err.code == 26) {
                // Collection does not exist
                return done();
            }
            throw err
        });        
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
    it("Tries to edit a post", done => {
        Users.findOne().then(foundUser => {
            Post.create({
                'title': 'test-post',
                'md': '# First post \n Welcome to my first post on this blog!',
                'resume': 'A summary of the first blog post',
                'author': foundUser.get('id'),
                'tags': ['intro','welcome','new','test']
            }).then(createdPost => {
                agent.put("/posts/edit")
                .type('form')
                .send({
                    '_id': createdPost.get('id'),
                    'title': 'edited'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    Post.findById(createdPost.get('id')).then(foundPost => {
                        expect(foundPost.title).to.not.have.string("edited");
                        done();
                    })
                })
            }).catch(err => {throw err});
        }).catch(err => {throw err});
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