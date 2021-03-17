process.env.NODE_ENV = 'test';

let server = require('../realtimestocks');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
chai.use(chaiHttp);
/*
 * Test the /POST route
 */
describe('/POST webhook', () => {
    it('it should not POST a Stock without company field', (done) => {
        let webhook_data = {}
        chai.request(server)
            .post('/webhook')
            .send(webhook_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('company name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should not POST a Stock with company field empty', (done) => {
        let webhook_data = {
            company: ""
        }
        chai.request(server)
            .post('/webhook')
            .send(webhook_data)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('company name cannot be empty or NULL');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Failed');
                done();
            });
    });
    it('it should return a successfull response when company is passed', (done) => {
        let webhook_data = {
            company: "Facebook"
        }
        chai.request(server)
            .post('/webhook')
            .send(webhook_data)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').to.be.an('object');
                res.body.should.have.property('status');
                res.body.should.have.property('status').eql('Success');
                done();
            });
    });
});