require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const log = require('loglevel');
require('../server/setup');
const request = require('supertest'); // eslint-disable-line
const server = require('../server/app');

(async () => {
  for (let i = 0; i < 1000; i += 1) {
    await request(server).get(`/stakeholders`);
    log.info(`request ${i + 1}`);
  }
})();
