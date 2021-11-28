const expect = require('expect-runtime');
const BaseRepository = require('./BaseRepository');

class StakeholderRepository extends BaseRepository {
  constructor(session) {
    super('entity', session);
    this._tableName = 'entity';
    this._session = session;
    // super('stakeholder', session);
    // this._tableName = 'stakeholder';
    // this._session = session;
  }

  // THIS IS FOR THE OLD DB SCHEMA: PUBLIC & ENTITY TABLES

  async getStakeholderByOrganizationId(organization_id, options) {
    console.log('getStakeholderOrganizationById ---> ', organization_id);

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

  // THIS IS FOR THE NEW DB SCHEMA: STAKEHOLDER

  async getStakeholderById(id, options) {
    // console.log('getStakeholderById id ---> ', id);
    const stakeholder = await this._session
      .getDB()(this._tableName)
      .select('*')
      .where('id', id)
      .first();

    stakeholder.children = await this.getChildren(stakeholder.id);
    stakeholder.parents = await this.getParents(stakeholder.id);

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where('id', id);

    // console.log('stakeholder1 ---> ', stakeholder);

    return { stakeholders: [stakeholder], count: +count[0].count };
  }

  async getParents(id) {
    const parentIds = await this._session
      .getDB()(this._tableName)
      .select('stakeholder_relations.relation_id')
      .join(
        'stakeholder_relations',
        'stakeholder.id',
        'stakeholder_relations.org_id',
      )
      .where('stakeholder_relations.org_id', id)
      .andWhere('stakeholder_relations.relation_type', 'parent');

    // if parents are found, iterate to get their full data
    if (parentIds.length) {
      const arr = parentIds.map((parent) => parent.relation_id);

      return this._session
        .getDB()(this._tableName)
        .select('*')
        .where((builder) => builder.whereIn('id', arr));
    }

    return [];
  }

  async getChildren(id) {
    const childrenIds = await this._session
      .getDB()(this._tableName)
      .select('stakeholder_relations.relation_id')
      .join(
        'stakeholder_relations',
        'stakeholder.id',
        'stakeholder_relations.org_id',
      )
      .where('stakeholder_relations.org_id', id)
      .andWhere('stakeholder_relations.relation_type', 'child');

    // if children are found, iterate to get their full data
    if (childrenIds.length) {
      const arr = childrenIds.map((child) => child.relation_id);

      return this._session
        .getDB()(this._tableName)
        .select('*')
        .where((builder) => builder.whereIn('id', arr));
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
