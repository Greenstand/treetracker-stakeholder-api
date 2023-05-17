const BaseRepository = require('./BaseRepository');

class AppConfigRepository extends BaseRepository {
  constructor(session) {
    super('app_config', session);
    this._tableName = 'app_config';
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

      result.where('ac.active', true);
      result.where(filterObject);
      return result;
    };

    const knex = this._session.getDB();

    let promise = knex
      .select(
        'ac.id',
        'config_code',
        'stakeholder_id',
        's.org_name as org_name',
        'capture_flow',
        'capture_setup_flow',
        'ac.created_at',
        'ac.updated_at',
        knex.raw('count(at.id) as app_installation_count'),
      )
      .from(`${this._tableName} as ac`)
      .leftJoin('app_installation as at', 'ac.id', 'at.app_config_id')
      .join('stakeholder as s', 'ac.stakeholder_id', 's.id')
      .where((builder) => whereBuilder(filter, builder))
      .groupBy('ac.id', 'org_name');

    const { limit, offset } = options;
    if (limit) {
      promise = promise.limit(limit);
    }
    if (offset) {
      promise = promise.offset(offset);
    }

    const count = await this._session
      .getDB()(`${this._tableName} as ac`)
      .count('*')
      .join('stakeholder as s', `ac.stakeholder_id`, 's.id')
      .where((builder) => whereBuilder(filter, builder));

    const appConfigs = await promise;

    return { appConfigs, count: +count[0].count };
  }
}

module.exports = AppConfigRepository;
