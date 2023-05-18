require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const request = require('supertest');
const { expect } = require('chai');
const server = require('../server/app');
const stakeholderSeed = require('../database/seeds/11_story_stakeholder');
const knex = require('../server/database/knex');

describe('App Config API tests.', () => {
  before(async () => {
    await stakeholderSeed.seed(knex);
  });

  after(async () => {
    await knex('app_installation').del();
    await knex('app_config').del();
    await knex('stakeholder').del();
  });

  const configData = {
    config_code: 'config',
    stakeholder_id: stakeholderSeed.stakeholderOne.id,
    capture_flow: { capture: 'flow' },
    capture_setup_flow: { capture: 'setup flow' },
  };

  it(`should create an app config`, function (done) {
    request(server)
      .post(`/app_config`)
      .send(configData)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.config_code).to.eql(
          configData.config_code.toUpperCase(),
        );
        expect(res.body.capture_flow).to.eql(configData.capture_flow);
        expect(res.body.capture_flow).to.eql(configData.capture_flow);
        expect(res.body.capture_setup_flow).to.eql(
          configData.capture_setup_flow,
        );
        expect(res.body.stakeholder_id).to.eql(configData.stakeholder_id);
        if (err) return done(err);
        return done();
      });
  });

  it('should error out -- duplicate config code', function (done) {
    request(server)
      .post(`/app_config`)
      .send(configData)
      .set('Accept', 'application/json')
      .expect(422)
      .end(function (err, res) {
        expect(res.body.message).to.eql('Config code entered already exists');
        if (err) return done(err);
        return done();
      });
  });

  it(`should error out invalid config code -- activate an app config`, function (done) {
    request(server)
      .post(`/activate_app_config`)
      .send({ wallet: 'wallet', config_code: 'config1' })
      .set('Accept', 'application/json')
      .expect(422)
      .end(function (err, res) {
        expect(res.body.message).to.eql('Invalid config code received');
        if (err) return done(err);
        return done();
      });
  });

  it(`should activate an app config`, function (done) {
    request(server)
      .post(`/activate_app_config`)
      .send({ wallet: 'wallet', config_code: configData.config_code })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.config_code).to.eql(
          configData.config_code.toUpperCase(),
        );
        expect(res.body.capture_flow).to.eql(configData.capture_flow);
        expect(res.body.capture_setup_flow).to.eql(
          configData.capture_setup_flow,
        );
        if (err) return done(err);
        return done();
      });
  });

  it(`should not error out on multiple activations`, function (done) {
    request(server)
      .post(`/activate_app_config`)
      .send({ wallet: 'wallet', config_code: configData.config_code })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.config_code).to.eql(
          configData.config_code.toUpperCase(),
        );
        expect(res.body.capture_flow).to.eql(configData.capture_flow);
        expect(res.body.capture_setup_flow).to.eql(
          configData.capture_setup_flow,
        );
        if (err) return done(err);
        return done();
      });
  });

  it(`should get app_config`, function (done) {
    request(server)
      .get(`/app_config`)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.appConfigs.length).to.eql(1);
        expect(res.body.appConfigs[0].capture_flow).to.eql(
          configData.capture_flow,
        );
        expect(res.body.appConfigs[0].capture_setup_flow).to.eql(
          configData.capture_setup_flow,
        );
        expect(res.body.appConfigs[0].app_installation_count).to.eql(1);
        if (err) return done(err);
        return done();
      });
  });

  it(`should get app_installations`, function (done) {
    request(server)
      .get(`/app_installation`)
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        expect(res.body.appInstallations.length).to.eql(1);
        expect(res.body.appInstallations[0].wallet).to.eql('wallet');
        expect(
          new Date(res.body.appInstallations[0].latest_login_at),
        ).greaterThan(new Date(res.body.appInstallations[0].created_at));
        if (err) return done(err);
        return done();
      });
  });
});
