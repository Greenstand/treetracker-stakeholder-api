/*
 * Some utils for router/express
 */
const log = require('loglevel');
const { ValidationError } = require('joi');
const HttpError = require('./HttpError');
// const ApiKeyService = require("../services/ApiKeyService");
// const JWTService = require('../services/JWTService.js');
// const Session = require('../models/Session');

/*
 * This is from the library https://github.com/Abazhenov/express-async-handler
 * Made some customization for our project. With this, we can throw Error from
 * the handler function or internal function call stack, and parse the error,
 * send to the client with appropriate response (http error code & json body)
 *
 * USAGE: wrap the express handler with this function:
 *
 *  router.get("/xxx", handlerWrap(async (res, rep, next) => {
 *    ...
 *  }));
 *
 *  Then, add the errorHandler below to the express global error handler.
 *
 */
exports.handlerWrapper = (fn) =>
  function wrap(...args) {
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch((e) => {
      next(e);
    });
  };

exports.errorHandler = (err, req, res, _next) => {
  log.debug('errorHandler error:', err);
  if (err instanceof HttpError) {
    res.status(err.code).send({
      code: err.code,
      message: err.message,
    });
  } else if (err instanceof ValidationError) {
    res.status(422).send({
      code: 422,
      message: err.details.map((m) => m.message).join(';'),
    });
  } else {
    res.status(500).send({
      code: 500,
      message: `Unknown error (${err.message})`,
    });
  }
};

// exports.apiKeyHandler = exports.handlerWrapper(async (req, res, next) => {
//   const session = new Session();
//   const apiKey = new ApiKeyService(session);
//   await apiKey.check(req.headers['treetracker-api-key']);
//   log.debug('Valid Access');
//   next();
// });

// exports.verifyJWTHandler = exports.handlerWrapper(async (req, res, next) => {
//   const jwtService = new JWTService();
//   const decode = jwtService.verify(req.headers.authorization);
//   res.locals.wallet_id = decode.id;
//   next();
// });

exports.camelToSnakeCase = (str) =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

exports.generatePrevAndNext = ({
  url,
  count,
  limitOptions: { limit, offset },
  queryObject,
}) => {
  // offset starts from 0, hence the -1
  const noOfIterations = count / limit - 1;
  const currentIteration = offset / limit;

  const queryObjectCopy = { ...queryObject };
  delete queryObjectCopy.offset;

  const query = Object.keys(queryObjectCopy)
    .map((key) => `${key}=${encodeURIComponent(queryObjectCopy[key])}`)
    .join('&');

  const urlWithLimitAndOffset = `${url}?${query}&offset=`;

  const nextUrl =
    currentIteration < noOfIterations
      ? `${urlWithLimitAndOffset}${+offset + +limit}`
      : null;
  let prev = null;
  if (offset - +limit >= 0) {
    prev = `${urlWithLimitAndOffset}${+offset - +limit}`;
  }

  return { next: nextUrl, prev };
};
