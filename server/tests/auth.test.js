let chai = require("chai");
let {expect, assert} = chai
let chaiHTTP = require("chai-http");
chai.use(chaiHTTP);

let app = require("../app");
let agent = chai.request.agent(app).keepOpen(); /* Needed to keep sesion cookies accross sessions */

describe("Logging in and logging out", function() {
    it("Should log in", function(done) {
        agent.post('/auth/login')
        .type('form')
        .send({
            'username': 'admin',
            'password': 'admin'
        })
        .end(function(err, res) {
            if (err) {console.log(err); done()};
            expect(res).to.have.status(200);
            done();
        })
    });
    it("Should try to log in and fail", function(done) {
        agent.post('/auth/login')
        .type('form')
        .send({
            username: "admin",
            password: "wrong password"
        })
        .end(function(err, res) {
            if (err) throw err;
            expect(res).to.have.status(401);
            done();
        })
    });
    it("Should log out", function(done) {
        agent.get("/auth/logout")
        .end(function(err, res) {
            if (err) throw err;
            expect(res).to.have.status(200);
            /**
             * Now, another request should fail
             */
            agent.get("/posts/all") // This is a protected route
            .end(function(err, res) {
                if (err) throw err;
                expect(res).to.have.status(401)
                done()
            })
        });
    });
    
});

after(function() {
    agent.close();
})