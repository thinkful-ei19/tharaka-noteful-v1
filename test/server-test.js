'use strict';

const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Reality check', function () {

  it('true should be true', function () {
    expect(true).to.be.true;
  });

  it('2 + 2 should equal 4', function () {
    expect(2 + 2).to.equal(4);
  });

});

describe('Express static', function () {

  it('GET request "/" should return the index page', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.html;
      });
  });
  
});
  
describe('404 handler', function () {
  
  it('should respond with 404 when given a bad path', function () {
    return chai.request(app)
      .get('/bad/path')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
  
});


describe('http request', function () {

  it('GET request notes should return items', function () {
    return chai.request(app)
      .get('/v1/notes')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        // because we create three items on app load
        expect(res.body.length).to.be.at.least(1);
        // each item should be an object with key/value pairs
        // for `id`, `name` and `checked`.
        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function(item) {
          expect(item).to.be.a('object');
          expect(item).to.include.keys(expectedKeys);
        });        
      });

  });

  it('should get note id item', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/v1/notes')
      .then(function(res) {
        return chai.request(app)
          .get(`/v1/notes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        const expectedKeys = ['id', 'title', 'content'];
        expect(res.body).to.include.keys(expectedKeys);
        expect(res).to.be.a('object');
      });
  });

  it('should update item on put', function() {
    const updateData = {
      title: 'blah sandwitch',
      content: 'blah blah blah'
    };
  
    return chai.request(app)
    // first have to get so we have an idea of object to update
      .get('/v1/notes')
      .then(function(res) {
        updateData.id = res.body[0].id;

        return chai.request(app)
          .put(`/v1/notes/${updateData.id}`)
          .send(updateData);
      })

      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updateData);
      });
  });
  
  it('should add an note item on POST', function() {
    const newItem = {title: 'coffee', content: 'blahblah'};
    return chai.request(app)
      .post('/v1/notes')
      .send(newItem)
      .then(function(res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newItem, {id: res.body.id}));
      });
  });

  it('should delete note on DELETE', function() {
    return chai.request(app)
      // first have to get so we have an `id` of item
      // to delete
      .get('/v1/notes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/v1/notes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(200);

      });
  });








});
