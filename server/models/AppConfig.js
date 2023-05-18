const AppConfigRepository = require('../repositories/AppConfigRepository');
const AppInstallationRepository = require('../repositories/AppInstallationRepository');
const HttpError = require('../utils/HttpError');

class AppConfig {
  constructor(session) {
    this._appConfigRepository = new AppConfigRepository(session);
    this._appInstallationRepository = new AppInstallationRepository(session);
  }

  static AppConfig({
    id,
    config_code,
    stakeholder_id,
    org_name,
    capture_flow,
    capture_setup_flow,
    created_at,
    updated_at,
    app_installation_count,
  }) {
    return Object.freeze({
      id,
      config_code: config_code.toUpperCase(),
      stakeholder_id,
      org_name,
      capture_flow,
      capture_setup_flow,
      created_at,
      updated_at,
      app_installation_count: +app_installation_count,
    });
  }

  static AppInstallation({
    id,
    wallet,
    app_config_id,
    config_code,
    created_at,
    latest_login_at,
  }) {
    return Object.freeze({
      id,
      wallet,
      app_config_id,
      config_code: config_code.toUpperCase(),
      created_at,
      latest_login_at,
    });
  }

  async getAppConfigs(filter = {}, limitOptions) {
    const { appConfigs, count } = await this._appConfigRepository.getByFilter(
      filter,
      limitOptions,
    );

    return {
      appConfigs: appConfigs.map((a) => this.constructor.AppConfig(a)),
      totalCount: count,
    };
  }

  async createAppConfig(configBody) {
    const { config_code } = configBody;

    // add a check to make sure the stakeholder is an organization???

    // check if config_code exists
    const existingConfig = await this.getAppConfigs({
      config_code,
    });

    if (existingConfig.appConfigs.length) {
      throw new HttpError(422, 'Config code entered already exists');
    }

    const result = await this._appConfigRepository.create(configBody);
    return this.constructor.AppConfig(result);
  }

  async activateAppConfig({ wallet, config_code }) {
    // check if config_code exists
    const result = await this.getAppConfigs({
      config_code,
    });

    const appConfig = result.appConfigs[0];

    if (!appConfig) {
      throw new HttpError(422, 'Invalid config code received');
    }

    await this._appInstallationRepository.create({
      wallet,
      appConfigId: appConfig.id,
    });

    return this.constructor.AppConfig(appConfig);
  }

  async getAppInstallations(filter = {}, limitOptions) {
    const { appInstallations, count } =
      await this._appInstallationRepository.getByFilter(filter, limitOptions);

    return {
      appInstallations: appInstallations.map((a) =>
        this.constructor.AppInstallation(a),
      ),
      totalCount: count,
    };
  }
}

module.exports = AppConfig;
