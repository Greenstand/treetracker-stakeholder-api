const router = require('express').Router();
const log = require('loglevel');
const validateRequest = (req, res, next) => {
  log.debug('STAKEHOLDER ROUTER');
  next();
};
const {
  // stakeholderPost,
  stakeholderGet,
  stakeholderPatch,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper } = require('./utils/utils');

// router.route('/').get(validateRequest, (req, res) => {
//   log.debug('REQUESTED ---->', req.url);
//   res.send('request made');
// });

router
  .get('/', handlerWrapper(stakeholderGet))
  .patch(validateRequest, handlerWrapper(stakeholderPatch));
// .post(validateRequest, handlerWrapper(stakeholderPost))
// .delete(validateRequest, handlerWrapper(stakeholderDelete));

// router
//   .route('/stakeholders')
//   .get(validateRequest, stakeholdersGet)

// router
//   .route('/users')
//   .get(validateRequest, usersGet)

module.exports = router;
