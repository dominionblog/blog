let chai = require('chai')
let chaiHTTP = require("chai-http")
let chaiAsPromised = require("chai-as-promised")
let app = require("../app")
chai.use(chaiHTTP)
chai.use(chaiAsPromised)

let {expect} = chai
let agent = chai.request.agent(app).keepOpen();

let oldPassword = 'admin'
let newPassword = 'newpass'

describe("Change your password", () => {
    before("logs the user in", done => {
        expect(agent.post("/auth/login").type('form').send({
            username: 'admin',
            password: oldPassword
        })).to.eventually.have.status(200).notify(done);
    })
    it("changes the password for the currently logged in user", done => {
        agent.put("/auth/pass/change").type('form').send({
            oldPassword: oldPassword,
            newPassword: newPassword
        }).then(res => {
            expect(res).to.have.status(200);
            // Logout
            agent.get("/auth/logout").then(res => {
                expect(res).to.have.status(200);
                // Log back in using new password
                agent.post("/auth/login").type('form').send({
                    username: 'admin',
                    password: newPassword
                }).then(res => {
                    expect(res).to.have.status(200);
                    done();
                })
            })
        })
    })
    after("change the password back", done => {
        expect(agent.put('/auth/pass/change').type('form').send({
            oldPassword: newPassword,
            newPassword: oldPassword 
        })).to.eventually.have.status(200).notify(done);
    })
})