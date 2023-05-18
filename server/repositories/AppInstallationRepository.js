const BaseRepository = require('./BaseRepository');

class AppInstallationRepository extends BaseRepository {
  constructor(session) {
    super('app_installation', session);
    this._tableName = 'app_installation';
    this._session = session;
  }

  async getByFilter(filter, options = {}) {
    const whereBuilder = function (object, builder) {
      const result = builder;
      const filterObject = { ...object };

      if (filterObject.config_code) {
        result.where('config_code', 'ilike', filterObject.config_code);
        delete filterObject.config_code;
      }
      result.where(filterObject);

      return result;
    };

    const knex = this._session.getDB();

    let promise = knex
      .select(
        'at.id',
        'ac.config_code',
        'wallet',
        'app_config_id',
        'at.created_at',
        'latest_login_at',
      )
      .from(`${this._tableName} as at`)
      .join('app_config as ac', 'ac.id', 'at.app_config_id')
      .join('stakeholder as s', 'ac.stakeholder_id', 's.id')
      .where((builder) => whereBuilder(filter, builder));

    const { limit, offset } = options;
    if (limit) {
      promise = promise.limit(limit);
    }
    if (offset) {
      promise = promise.offset(offset);
    }

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .join('app_config as ac', 'ac.id', `${this._tableName}.app_config_id`)
      .join('stakeholder as s', 'ac.stakeholder_id', 's.id')
      .where((builder) => whereBuilder(filter, builder));

    const appInstallations = await promise;

    return { appInstallations, count: +count[0].count };
  }

  async create({ wallet, appConfigId }) {
    const result = await this._session
      .getDB()(this._tableName)
      .insert({ wallet, app_config_id: appConfigId })
      .onConflict(['wallet', 'app_config_id'])
      .merge({ latest_login_at: new Date().toISOString() });
    return result;
  }
}

module.exports = AppInstallationRepository;
