const BaseRepository = require('./BaseRepository');

class StakeholderRepository extends BaseRepository {
  constructor(session) {
    super('entity', session);
    this._tableName = 'entity';
    this._session = session;
  }

  async getStakeholderByOrganizationId(organization_id, options) {
    const result = await this._session
      .getDB()
      .raw(
        'select * from entity where id in (select entity_id from getEntityRelationshipChildren(?)) limit ? offset ?',
        [organization_id, options.limit, options.offset],
      );

    const count = await this._session
      .getDB()
      .raw(
        'select count(*) from entity where id in (select entity_id from getEntityRelationshipChildren(?))',
        [organization_id],
      );

    return { stakeholders: result.rows, count: +count.rows[0].count };
  }
}

module.exports = StakeholderRepository;
