const express = require('express');
const router = express.Router();
const validateRequest = (req, res, next) => {
  console.log('STAKEHOLDER ROUTER');
  next();
};
const {
  stakeholderPost,
  stakeholderGet,
  stakeholderGetById,
  stakeholderPatch,
} = require('./handlers/stakeholderHandler');
const { handlerWrapper } = require('./utils/utils');

// const {
//   candidatePost,
//   candidateGet,
// } = require('./handlers/candidateHandler');

router.get('/stakeholder', handlerWrapper(stakeholderGet));

router
  .route('/stakeholders')
  .get(validateRequest, stakeholderGet)
  .post(validateRequest, stakeholderPost);

router
  .route('/stakeholders/:id')
  .get(validateRequest, stakeholderGetById)
  .patch(validateRequest, stakeholderPatch);

// router('/candidates')
//   .get('/candidates', validateRequest, candidateHandlerGet)
//   .post(validateRequest, candidateHandlerPost);

module.exports = router;
