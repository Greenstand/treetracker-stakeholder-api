require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const request = require('supertest');
const { expect } = require('chai');
const server = require('../server/app');
const stakeholderSeed = require('../database/seeds/11_story_stakeholder');
const knex = require('../server/database/knex');

describe('Stakeholder API tests.', () => {
  before(async () => {
    await stakeholderSeed.seed(knex);
  });

  after(async () => {
    await knex('stakeholder').del();
  });

  describe('Stakeholder GET', () => {
    it(`Should raise validation error with error code 422 -- 'id' should be a uuid  `, function (done) {
      request(server)
        .get(`/stakeholders`)
        .query({
          id: 'stakeholder_uuid',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"id" must be a valid GUID');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should get stakeholder successfully -- with query id `, function (done) {
      request(server)
        .get(`/stakeholders`)
        .query({ id: stakeholderSeed.stakeholderOne.id })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys([
            'stakeholders',
            'totalCount',
            'links',
            'query',
          ]);
          expect(res.body.totalCount).to.eq(1);
          expect(res.body.stakeholders[0]).to.eql({
            ...stakeholderSeed.stakeholderOne,
            status: 'active',
            rejection_reason: null,
            children: [],
            parents: [],
          });
          expect(res.body.stakeholders).to.have.length(1);
          return done();
        });
    });

    it(`Should get stakeholders successfully -- with query type `, function (done) {
      request(server)
        .get(`/stakeholders`)
        .query({ type: stakeholderSeed.stakeholderOne.type })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys([
            'stakeholders',
            'totalCount',
            'links',
            'query',
          ]);
          expect(res.body.totalCount).to.greaterThanOrEqual(2);
          expect(res.body.stakeholders).to.have.length(res.body.totalCount);
          return done();
        });
    });
  });

  describe('Stakeholder PATCH', () => {
    const { stakeholderThree } = stakeholderSeed;

    it(`Should update only the status -- other fields stay the same `, function (done) {
      request(server)
        .patch(`/stakeholders/${stakeholderThree.id}`)
        .send({ status: 'suspended' })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.status).to.eql('suspended');
          expect(res.body.org_name).to.eql(stakeholderThree.org_name);
          expect(res.body.email).to.eql(stakeholderThree.email);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'rejection_reason' is required when rejected `, function (done) {
      request(server)
        .patch(`/stakeholders/${stakeholderThree.id}`)
        .send({ status: 'rejected' })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"rejection_reason" is required');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'status' must be a known value `, function (done) {
      request(server)
        .patch(`/stakeholders/${stakeholderThree.id}`)
        .send({ status: 'deleted' })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should reject a stakeholder with a reason `, function (done) {
      request(server)
        .patch(`/stakeholders/${stakeholderThree.id}`)
        .send({ status: 'rejected', rejection_reason: 'Missing documents' })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.status).to.eql('rejected');
          expect(res.body.rejection_reason).to.eql('Missing documents');
          return done();
        });
    });

    it(`Should raise error with error code 400 -- body id does not match path id `, function (done) {
      request(server)
        .patch(`/stakeholders/${stakeholderThree.id}`)
        .send({ id: stakeholderSeed.stakeholderOne.id, status: 'active' })
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });

    it(`Should update a stakeholder with the id in the body -- PATCH /stakeholders `, function (done) {
      request(server)
        .patch(`/stakeholders`)
        .send({ id: stakeholderThree.id, status: 'active' })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body.id).to.eql(stakeholderThree.id);
          expect(res.body.status).to.eql('active');
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'id' is required `, function (done) {
      request(server)
        .patch(`/stakeholders`)
        .send({ status: 'active' })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });
  });
});
