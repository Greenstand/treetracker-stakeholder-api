const express = require('express');

const router = express.Router();
const { stakeholderGet } = require('./handlers/stakeholderHandler');

const { handlerWrapper } = require('./utils/utils');

router.get('/stakeholder', handlerWrapper(stakeholderGet));

module.exports = router;
