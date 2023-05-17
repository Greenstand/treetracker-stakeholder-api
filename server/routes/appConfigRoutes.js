const router = require('express').Router();

const {
  appInstallationGet,
  appConfigGet,
  appConfigPost,
  activateAppConfig,
} = require('../handlers/appConfigHandler');
const { handlerWrapper } = require('../utils/utils');

router
  .route('/app_config')
  .get(handlerWrapper(appConfigGet))
  .post(handlerWrapper(appConfigPost));

router.route('/app_installation').get(handlerWrapper(appInstallationGet));
router.route('/activate_app_config').post(handlerWrapper(activateAppConfig));

module.exports = router;
