const express = require('express');
const cors = require('cors');
const log = require('loglevel');
const swaggerUi = require('swagger-ui-express');
const { join } = require('path');

const HttpError = require('./utils/HttpError');
const { handlerWrapper, errorHandler } = require('./utils/utils');
const swaggerDocument = require('./handlers/swaggerDoc');
const router = require('./routes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  log.info('disable cors');
  app.use(cors());
}

/*
 * Check request
 */
app.use(
  handlerWrapper(async (req, _res, next) => {
    if (
      req.method === 'POST' ||
      req.method === 'PATCH' ||
      req.method === 'PUT'
    ) {
      if (req.headers['content-type'] !== 'application/json') {
        throw new HttpError(
          415,
          'Invalid content type. API only supports application/json',
        );
      }
    }
    next();
  }),
);

const options = {
  customCss: `
    .topbar-wrapper img { 
      content:url('../assets/greenstand.webp');
      width:80px; 
      height:auto;
    }
    `,
  explorer: true,
};

app.use('/assets', express.static(join(__dirname, '..', '/assets')));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use('/', router);

app.use(errorHandler);

const { version } = require('../package.json');

app.get('*', function (req, res) {
  res.status(200).send(version);
});

module.exports = app;
