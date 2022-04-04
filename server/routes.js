const router = require('express').Router();

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
  .get(handlerWrapper(stakeholderGetRelations))
  .post(handlerWrapper(stakeholderCreateRelation))
  .delete(handlerWrapper(stakeholderDeleteRelation));

router
  .route('/stakeholders/:id')
  .get(handlerWrapper(stakeholderGetAllById))
  .post(handlerWrapper(stakeholderCreate))
  .patch(handlerWrapper(stakeholderUpdate));

router
  .route('/stakeholders')
  .get(handlerWrapper(stakeholderGetAll))
  .post(handlerWrapper(stakeholderCreate))
  .patch(handlerWrapper(stakeholderUpdate));

module.exports = router;
