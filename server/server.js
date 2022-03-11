require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const log = require('loglevel');
// setup log level
require('./setup');
const app = require('./app');

const PORT = process.env.NODE_PORT || 3006;

app.listen(PORT, () => {
  log.info(`listening on port:${PORT}`);
  log.debug('debug log level!');
});
