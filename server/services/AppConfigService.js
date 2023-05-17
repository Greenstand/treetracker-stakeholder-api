const Session = require('../database/Session');
const AppConfig = require('../models/AppConfig');

class AppConfigService {
  constructor() {
    this._session = new Session();
    this._appConfig = new AppConfig(this._session);
  }

  async getAppConfigs(filter, limitOptions) {
    return this._appConfig.getAppConfigs(filter, limitOptions);
  }

  async createAppConfig({
    stakeholder_id,
    config_code,
    capture_flow,
    capture_setup_flow,
  }) {
    try {
      await this._session.beginTransaction();
      const result = await this._appConfig.createAppConfig({
        stakeholder_id,
        config_code,
        capture_flow,
        capture_setup_flow,
      });
      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async activateAppConfig({ wallet, config_code }) {
    try {
      await this._session.beginTransaction();

      const result = await this._appConfig.activateAppConfig({
        wallet,
        config_code,
      });

      await this._session.commitTransaction();

      return result;
    } catch (e) {
      if (this._session.isTransactionInProgress()) {
        await this._session.rollbackTransaction();
      }
      throw e;
    }
  }

  async getAppInstallations(filter, limitOptions) {
    return this._appConfig.getAppInstallations(filter, limitOptions);
  }
}

module.exports = AppConfigService;
