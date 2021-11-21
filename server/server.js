require('dotenv').config();
const log = require('loglevel');
// setup log level
require('./setup');
const app = require('./app');
const knex = require('../database/connection');
const PORT = process.env.NODE_PORT || 3006;

knex.migrate
  .latest()
  .then((migrations) => {
    log.info('migrations', migrations);
    app.listen(PORT, () => {
      log.info(`Listening on Port ${PORT}!`);
      log.debug('debug log level!');
    });
  })
  .catch((error) => {
    log.error(error);
    knex.destroy();
  });
