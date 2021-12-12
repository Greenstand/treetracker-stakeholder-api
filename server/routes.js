const router = require('express').Router();
// const log = require('loglevel');
// const validateRequest = (req, res, next) => {
//   next();
// };
const {
  stakeholderGet,
  stakeholderGetAll,
  stakeholderGetUnlinked,
  stakeholderUpdateLink,
  stakeholderPatch,
  stakeholderPost,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper } = require('./utils/utils');

router
  .route('/links/:stakeholder_id')
  .get(handlerWrapper(stakeholderGetUnlinked))
  .patch(handlerWrapper(stakeholderUpdateLink));

router
  .route('/links')
  .get(handlerWrapper(stakeholderGetUnlinked))
  .patch(handlerWrapper(stakeholderUpdateLink));

router
  .route('/:stakeholder_id')
  .get(handlerWrapper(stakeholderGet))
  .patch(handlerWrapper(stakeholderPatch))
  .post(handlerWrapper(stakeholderPost)); // for account sign-ons

router
  .route('/')
  .get(handlerWrapper(stakeholderGetAll))
  .patch(handlerWrapper(stakeholderPatch))
  .post(handlerWrapper(stakeholderPost));
// .delete(handlerWrapper(stakeholderDelete));

module.exports = router;
