const router = require('express').Router();
const uuid = require('uuid');
const { ValidationError } = require('joi');
const {
  stakeholderGetAllById,
  stakeholderGetAll,
  stakeholderGetRelations,
  stakeholderCreateRelation,
  stakeholderDeleteRelation,
  stakeholderUpdate,
  stakeholderCreate,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper, errorHandler } = require('./utils/utils');
const log = require('loglevel');

const validateRequest = (req, res, next) => {
  console.log('QUERY -------> ', req.query);

  if(!req.query.limit && !Number.isInteger(+req.query.limit)) {
    // throw new ValidationError('limit must be an integer');
    // next({ status: 422, message: '"limit" must be an integer' });
    return errorHandler(
      new ValidationError('limit must be an integer'),
      req,
      res,
    );
  }
  if (req.query.limit && +req.query.limit < 1) {
    next({ status: 422, message: '"limit" must be greater than 0' });
    // errorHandler({ status: 422, message: '"limit" must be greater than 0' }, req, res);
  }
  if (req.query.limit && +req.query.limit > 100) {
    next({ status: 422, message: '"limit" must be less than 101' });
    // errorHandler({ status: 422, message: '"limit" must be less than 101' }, req, res);
  }
  if (req.query.offset && !Number.isInteger(+req.query.offset)) {
    next({ status: 422, message: '"offset" must be an integer' });
    // errorHandler({ status: 422, message: '"offset" must be an integer' }, req, res);
  }
  if (req.query.offset && +req.query.offset < 0) {
    next({ status: 422, message: '"offset" must be greater than -1' });
    // errorHandler({ status: 422, message: '"offset" must be greater than -1' }, req, res);
  }
  if (req.query.id && !uuid.validate(req.query.id)) {
    next({ status: 422, message: '"id" must be a valid GUID' });
    // errorHandler({ status: 422, message: '"id" must be a valid GUID' }, req, res);
  }
  if (req.query.owner_id && !uuid.validate(req.query.owner_id)) {
    next({ status: 422, message: '"id" must be a valid GUID' });
    // errorHandler({ status: 422, message: '"id" must be a valid GUID' }, req, res);
  }
  if(req.query.organization_id && !Number.isInteger(+req.query.organization_id)) {
    next({ status: 422, message: '"organization_id" must be an integer' });
    // errorHandler(
    //   { status: 422, message: '"organization_id" must be an integer' },
    //   req,
    //   res,
    // );
  }

  next();
};

router
  .route('/stakeholders/relations/:id')
  .get(handlerWrapper(validateRequest), handlerWrapper(stakeholderGetRelations))
  .post(handlerWrapper(validateRequest), handlerWrapper(stakeholderCreateRelation))
  .delete(handlerWrapper(validateRequest), handlerWrapper(stakeholderDeleteRelation));

router
  .route('/stakeholders/:id')
  .get(handlerWrapper(validateRequest), handlerWrapper(stakeholderGetAllById))
  .post(handlerWrapper(validateRequest), handlerWrapper(stakeholderCreate))
  .patch(handlerWrapper(validateRequest), handlerWrapper(stakeholderUpdate));

router
  .route('/stakeholders')
  .get(handlerWrapper(validateRequest), handlerWrapper(stakeholderGetAll))
  .post(handlerWrapper(validateRequest), handlerWrapper(stakeholderCreate))
  .patch(handlerWrapper(validateRequest), handlerWrapper(stakeholderUpdate));

module.exports = router;
