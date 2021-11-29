const router = require('express').Router();
// const log = require('loglevel');
// const validateRequest = (req, res, next) => {
//   next();
// };
const {
  stakeholderGet,
  stakeholderGetAll,
  stakeholderPatch,
  stakeholderPost,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper } = require('./utils/utils');

router
  .route('/')
  .get(handlerWrapper(stakeholderGetAll))
  .patch(handlerWrapper(stakeholderPatch))
  .post(handlerWrapper(stakeholderPost));
// .delete(handlerWrapper(stakeholderDelete));

router
  .route('/:stakeholder_id')
  .get(handlerWrapper(stakeholderGet))
  .patch(handlerWrapper(stakeholderPatch)); // for account sign-ons

module.exports = router;
