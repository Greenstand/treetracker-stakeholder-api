const AppConfigService = require('../../services/AppConfigService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const {
  appConfigPostSchema,
  activateAppConfigSchema,
  appConfigGetQuerySchema,
  appInstallationsGetQuerySchema,
} = require('./schemas');

const appInstallationGet = async (req, res) => {
  await appInstallationsGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const appConfigService = new AppConfigService();

  const { appInstallations, totalCount } =
    await appConfigService.getAppInstallations(filter, limitOptions);

  const url = 'app_installation';

  const links = generatePrevAndNext({
    url,
    count: totalCount,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    appInstallations,
    links,
    totalCount,
    query: { ...limitOptions, ...filter },
  });
};

const appConfigGet = async (req, res) => {
  await appConfigGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const appConfigService = new AppConfigService();

  const { appConfigs, totalCount } = await appConfigService.getAppConfigs(
    filter,
    limitOptions,
  );

  const url = 'app_config';

  const links = generatePrevAndNext({
    url,
    count: totalCount,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    appConfigs,
    links,
    totalCount,
    query: { ...limitOptions, ...filter },
  });
};

const appConfigPost = async function (req, res) {
  await appConfigPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const appConfigService = new AppConfigService();
  const result = await appConfigService.createAppConfig(req.body);

  res.send(result);
};

const activateAppConfig = async function (req, res) {
  await activateAppConfigSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const appConfigService = new AppConfigService();
  const result = await appConfigService.activateAppConfig(req.body);

  res.send(result);
};

module.exports = {
  appInstallationGet,
  appConfigGet,
  appConfigPost,
  activateAppConfig,
};
