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
          expect(res.body.totalCount).to.eql(2);
          expect(res.body.stakeholders).to.have.length(res.body.totalCount);
          return done();
        });
    });
  });
});
