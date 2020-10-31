let chai = require("chai");
let {expect, assert} = chai
let chaiHTTP = require("chai-http");
chai.use(chaiHTTP);

let app = require("../app");
let agent = chai.request.agent(app).keepOpen(); /* Needed to keep sesion cookies accross sessions */

describe("Getting Posts", function() {
    before("Log in", function(done) {
        /**
         * Logs the user in
         */
        agent.post("/auth/login")
        .type('form')
        .send({
            'username':'admin',
            'password':'admin'
        })
        .end(function(err, res) {
            if (err) console.log(err);
            done();
        })
    })
})

after(function() {
    agent.close();
})