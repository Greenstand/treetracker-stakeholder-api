require('dotenv').config();
const request = require('supertest');
const { expect } = require('chai');
const server = require('../../server/app');
const { stakeholderOne, stakeholderTwo } = require('./seed-data-creation');

describe.skip('Stakeholder API tests.', () => {
  describe('Stakeholder GET', () => {
    it(`Should raise validation error with error code 422 -- 'limit' query parameter should be an integer  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          limit: 8.965,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"limit" must be an integer');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'limit' query parameter should be greater than 0  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          limit: 0,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"limit" must be greater than 0');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'limit' query parameter should be less than 101  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          limit: 101,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"limit" must be less than 101');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'offset' query parameter should be an integer  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          offset: 4.45,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"offset" must be an integer');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'offset' query parameter should be at least 0  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          offset: -1,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"offset" must be greater than -1');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'stakeholder_uuid' should be a uuid  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          stakeholder_uuid: 'stakeholder_uuid',
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql(
            '"stakeholder_uuid" must be a valid GUID',
          );
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'id' query parameter should be an integer  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          id: 8.965,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql('"id" must be an integer');
          if (err) return done(err);
          return done();
        });
    });

    it(`Should raise validation error with error code 422 -- 'organization_id' query parameter should be an integer  `, function (done) {
      request(server)
        .get(`/`)
        .query({
          organization_id: 8.965,
        })
        .set('Accept', 'application/json')
        .expect(422)
        .end(function (err, res) {
          expect(res.body.message).to.eql(
            '"organization_id" must be an integer',
          );
          if (err) return done(err);
          return done();
        });
    });

    it(`Should get stakeholder successfully -- with limit `, function (done) {
      request(server)
        .get(`/`)
        .query({ limit: 2 })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys([
            'stakeholders',
            'links',
            'totalCount',
          ]);
          expect(res.body.links).to.have.keys(['prev', 'next']);
          expect(res.body.links.prev).to.eq(null);
          expect(res.body.stakeholders).to.have.lengthOf(2);

          for (const stakeholder of res.body.stakeholders) {
            expect(stakeholder).to.have.keys([
              'id',
              'type',
              'org_name',
              'first_name',
              'last_name',
              'email',
              'phone',
              // 'pwd_reset_required',
              'website',
              // 'wallet',
              // 'password',
              // 'salt',
              // 'active_contract_id',
              // 'offering_pay_to_plant',
              // 'tree_validation_contract_id',
              'logo_url',
              'map',
              'stakeholder_uuid',
            ]);
          }

          return done();
        });
    });

    it(`Should get stakeholder successfully -- with query stakeholder_uuid `, function (done) {
      request(server)
        .get(`/`)
        .query({ stakeholder_uuid: stakeholderTwo.stakeholder_uuid })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys([
            'stakeholders',
            'links',
            'totalCount',
          ]);
          expect(res.body.links).to.have.keys(['prev', 'next']);
          expect(res.body.links.prev).to.eq(null);
          expect(res.body.totalCount).to.eq(1);
          expect(res.body.stakeholders[0]).to.eql({ ...stakeholderTwo });
          expect(res.body.stakeholders).to.have.lengthOf(1);
          return done();
        });
    });

    it(`Should get stakeholder successfully -- with query id `, function (done) {
      request(server)
        .get(`/`)
        .query({ id: stakeholderOne.id })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.keys([
            'stakeholders',
            'links',
            'totalCount',
          ]);
          expect(res.body.links).to.have.keys(['prev', 'next']);
          expect(res.body.links.prev).to.eq(null);
          expect(res.body.totalCount).to.eq(1);
          expect(res.body.stakeholders[0]).to.eql({ ...stakeholderOne });
          expect(res.body.stakeholders).to.have.lengthOf(1);
          return done();
        });
    });
  });
});
