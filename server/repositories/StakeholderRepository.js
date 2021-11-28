const expect = require('expect-runtime');
const BaseRepository = require('./BaseRepository');

class StakeholderRepository extends BaseRepository {
  constructor(session) {
    // super('entity', session);
    // this._tableName = 'entity';
    // this._session = session;
    super('stakeholder', session);
    this._tableName = 'stakeholder';
    this._session = session;
  }

  // async getStakeholderByOrganizationId(organization_id, options) {
  //   const result = await this._session
  //     .getDB()
  //     .raw(
  //       'select * from entity where id in (select entity_id from getEntityRelationshipChildren(?)) limit ? offset ?',
  //       [organization_id, options.limit, options.offset],
  //     );

  //   const count = await this._session
  //     .getDB()
  //     .raw(
  //       'select count(*) from entity where id in (select entity_id from getEntityRelationshipChildren(?))',
  //       [organization_id],
  //     );

  //   return { stakeholders: result.rows, count: +count.rows[0].count };
  // }

  async getStakeholderById(uuid, options) {
    // GETS ALL THE RELATED ORGS BUT CHILD/PARENT GROUPINGS
    const stakeholder = await this._session
      .getDB()(this._tableName)
      .select('*')
      .where('stakeholder_uuid', uuid)
      .first();

    stakeholder.children = await this.getChildren(stakeholder.stakeholder_uuid);
    stakeholder.parents = await this.getParents(stakeholder.stakeholder_uuid);

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where('stakeholder_uuid', uuid);
    return { stakeholders: [stakeholder], count: +count[0].count };
  }

  async getParents(uuid) {
    const parentIds = await this._session
      .getDB()(this._tableName)
      .select('stakeholder_relations.relation_id')
      .join(
        'stakeholder_relations',
        'stakeholder.stakeholder_uuid',
        'stakeholder_relations.org_id',
      )
      .where('stakeholder_relations.org_id', uuid)
      .andWhere('stakeholder_relations.relation_type', 'parent');

    if (parentIds.length) {
      const arr = parentIds.map((parent) => parent.relation_id);

      return this._session
        .getDB()(this._tableName)
        .select('*')
        .where((builder) => builder.whereIn('stakeholder_uuid', arr));
    }

    return [];
  }

  async getChildren(uuid) {
    const childrenIds = await this._session
      .getDB()(this._tableName)
      .select('stakeholder_relations.relation_id')
      .join(
        'stakeholder_relations',
        'stakeholder.stakeholder_uuid',
        'stakeholder_relations.org_id',
      )
      .where('stakeholder_relations.org_id', uuid)
      .andWhere('stakeholder_relations.relation_type', 'child');

    if (childrenIds.length) {
      const arr = childrenIds.map((child) => child.relation_id);

      return this._session
        .getDB()(this._tableName)
        .select('*')
        .where((builder) => builder.whereIn('stakeholder_uuid', arr));
    }
    return [];
  }

  async createStakeholder(object) {
    const result = await this._session
      .getDB()(this._tableName)
      .insert(object)
      .returning('*');
    expect(result).match([
      {
        id: expect.anything(),
      },
    ]);
    return result[0];
  }
}

module.exports = StakeholderRepository;
