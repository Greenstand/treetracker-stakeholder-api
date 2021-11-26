const express = require('express');
const router = express.Router();
const validateRequest = (req, res, next) => {
  console.log('STAKEHOLDER ROUTER');
  next();
};
const {
  stakeholderPost,
  stakeholderGet,
  stakeholderPatch,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper } = require('./utils/utils');

router.get('/stakeholder', handlerWrapper(stakeholderGet));

router
  .route('/stakeholders')
  .get(validateRequest, stakeholderGet)
  .post(validateRequest, stakeholderPost)
  .patch(validateRequest, stakeholderPatch);

module.exports = router;
