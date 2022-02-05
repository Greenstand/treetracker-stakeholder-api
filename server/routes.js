const router = require('express').Router();
const uuid = require('uuid');
const log = require('loglevel');

const validateRequest = (req, res, next) => {
  console.log('QUERY -------> ', req.query);

  if(req.query.limit && !Number.isInteger(+req.query.limit)) {
    // throw new Error('"limit" must be an integer');
    next({ status: 422, message: '"limit" must be an integer' });
  }
  if (req.query.limit && +req.query.limit < 1) {
    next({ status: 422, message: '"limit" must be greater than 0' });
  }
  if (req.query.limit && +req.query.limit > 100) {
    next({ status: 422, message: '"limit" must be less than 101' });
  }
  if (req.query.offset && !Number.isInteger(+req.query.offset)) {
    next({ status: 422, message: '"offset" must be an integer' });
  }
  if (req.query.offset && +req.query.offset < 0) {
    next({ status: 422, message: '"offset" must be greater than -1' });
  }
  if (req.query.id && !uuid.validate(req.query.id)) {
    next({ status: 422, message: '"id" must be a valid GUID' });
  }
  if (req.query.owner_id && !uuid.validate(req.query.owner_id)) {
    next({ status: 422, message: '"id" must be a valid GUID' });
  }
  if(req.query.organization_id && !Number.isInteger(+req.query.organization_id)) {
    next({ status: 422, message: '"organization_id" must be an integer' });
  }

  next();
};

const {
  stakeholderGetAllById,
  stakeholderGetAll,
  stakeholderGetRelations,
  stakeholderCreateRelation,
  stakeholderDeleteRelation,
  stakeholderUpdate,
  stakeholderCreate,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper } = require('./utils/utils');

router
  .route('/stakeholders/relations/:id')
  .get(validateRequest, handlerWrapper(stakeholderGetRelations))
  .post(validateRequest, handlerWrapper(stakeholderCreateRelation))
  .delete(validateRequest, handlerWrapper(stakeholderDeleteRelation));

router
  .route('/stakeholders/:id')
  .get(validateRequest, handlerWrapper(stakeholderGetAllById))
  .post(validateRequest, handlerWrapper(stakeholderCreate))
  .patch(validateRequest, handlerWrapper(stakeholderUpdate));

router
  .route('/stakeholders')
  .get(validateRequest, handlerWrapper(stakeholderGetAll))
  .post(validateRequest, handlerWrapper(stakeholderCreate))
  .patch(validateRequest, handlerWrapper(stakeholderUpdate));

module.exports = router;
