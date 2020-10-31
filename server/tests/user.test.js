const { expect } = require('chai');
let chai = require('chai');
const chaiHTTP = require('chai-http');
const chaiAsPromised = require("chai-as-promised")
chai.use(chaiHTTP);
chai.use(chaiAsPromised);
const app = require("../app");
const _ = require("lodash")

const User = require("../models/user");

let agent = chai.request.agent(app).keepOpen();

describe("Getting user information", function() {
    before("deletes all test user accounts", function(done) {
        User.deleteMany({username: {$in: ["testuser","user-01","user-02","user-03"]}}).then(_ => {
            done()
        }).catch(err => {
            done(err);
        })
    })
    before("Logs the user in", function(done) {
        agent.post('/auth/login')
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
    it("Finds a user by ID", function(done) {
        User.findOne().then(user=> {
            agent.get("/users/view")
        .query({_id: user.get("id")})
        .end(function(err, res) {
            if (err) throw err;
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            done();
        })
        });
    });
    it("Gets all users", function(done) {
        agent.get("/users/all")
        .end(function(err, res) {
            if (err) throw err;
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.have.any.keys("username").and.not.to.have.all.keys("hash","salt")
            done();
        })
    });
    it("Creates a new user", function(done) {
        User.findOne({username: "testuser"}).then(foundUser => {
            // Make sure that there was no user to begin with
            expect(foundUser).to.be.null
            agent.post("/users/new")
            .type('form')
            .send({
                username: "testuser",
                name: "Test User",
                password: "testuser",
                email: "test@user.com",
                bio: 'A *great* user!'
            })
            .end((err, res) => {
                if (err) throw err
                expect(res).to.have.status(200);
                User.findOne({username: "testuser"}).then(foundUser => {
                    expect(foundUser.get('name')).to.be.string("Test User")
                    done();
                }).catch(err => {
                    throw err;
                })
            })
        }).catch(err => {done(err)});
    });
    it("Edits a user", done => {
        User.register({
                username: "test-user",
                name: "Test User",
                admin: true,
                bio: {
                    md: "Test",
                    html: "<p>Test</p>"
                },
                email: "test@test.co"
        },"test-user").then(user => {
            expect(agent.put("/users/edit").type('form').send({
                username: 'edited-user',
                name: 'New User!',
                email: 'new@user.ca',
                admin: true,
                bio: 'Edited User!',
                id: user.get('id')
            })).to.eventually.have.status(200).notify(() => {
                User.findById(user.get('id')).then(user => {
                    expect(user.get('username')).to.be.string("edited-user")
                    done()
                }).catch(err => {
                    done(err);
                })
            });
        }).catch(err => {
            done(err);
        })
    });
    it("gets the currently logged in user", function(done) {
        expect(agent.get("/users/me").then(res => {
            let expectedKeys = ["username","_id","name","bio"];
            expect(res).to.have.status(200);
            expect(_.pick(res.body,expectedKeys)).to.have.any.keys(expectedKeys);
            done();
        }).catch(err => {done(err)}));
    });
    it("edits the currently logged in user", function(done) {
        agent.get("/users/me").then(loggedUser => {
            agent.put("/users/self").type('form').send({
                name: "EDDY"
            }).then(res => {
                expect(res).to.have.status(200);
                User.findById(loggedUser.body._id).then(foundUser => {
                    expect(foundUser.get('name')).to.be.string('EDDY');
                    expect(foundUser.get('usernmae')).to.equal(loggedUser.get('username')) // Blank fields do not change
                    done();
                }).catch(err => {done(err)});
            })
        }).catch(err => {done(err)})
    })
    it("Sends an invalid email", done => {
        expect(agent.post("/users/new")
        .type('form')
        .send({
            username: 'user-01',
            password:'testuser',
            name: "Test User",
            email: 'not an email',
            bio: 'a *great* user!'
        })).to.eventually.have.status(400).notify(done)
    })
    it("sends an invalid username", done => {
        expect(agent.post("/users/new")
        .type('form')
        .send({
            username: '',
            password:'testuser',
            name: "Test User",
            email: 'not an email',
            bio: 'a grea!'
        })).to.eventually.have.status(400).notify(done)
    })
    it("sends an invalid password", done => {
        expect(agent.post("/users/new")
        .type('form')
        .send({
            username: "user-02",
            password: '',
            name: "Test User",
            email: "email@email.email",
            bio: 'a great bio!'
        })).to.eventually.have.status(400).notify(done)
    })
    it("sends an invalid name", done => {
        expect(agent.post("/users/new")
        .type('form')
        .send({
            username: "user-03",
            password: 'password',
            name: "",
            email: "email@email.email",
            bio: 'a great bio!'
        })).to.eventually.have.status(400).notify(done);
    })
    after(function() {
        agent.close()
    });
})