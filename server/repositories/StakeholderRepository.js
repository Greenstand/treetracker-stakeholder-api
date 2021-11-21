const expect = require('expect-runtime');
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
    super('stakeholder', session);
    this._tableName = 'stakeholder';
    this._session = session;
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

  async getStakeholders(filter, { limit, offset }) {
    console.log('STAKEHOLDER REPO get filter', filter);

    // // const whereBuilder = function (object, builder) {
    // //   const result = builder;
    // //   result.where('stakeholder.id', filter.id);
    // //   // result.orWhere('stakeholder.parent', filter.author_id);
    // //   // if (object.since) {
    // //   //   result = result.andWhere('message.created_at', '>=', object.since);
    // //   // }
    // //   return result;
    // // };

    // return this._session
    //   .getDB()(this._tableName)
    //   .select('*')
    //   .limit(limit)
    //   .groupBy('stakeholder.id')
    //   .offset(offset);
    // // .where((builder) => whereBuilder(filter, builder));

    return this._session
      .getDB()(this._tableName)
      .select('*')
      .limit(limit)
      .groupBy('stakeholder.id')
      .offset(offset);
  }

  async getStakeholderById(id) {
    console.log('STAKEHOLDER REPO get by id', id);

    // get the org in
    // join on the relation table
    // if it has parents, get & assign to "parents"
    // if it has children, get & assign to "children"
    const stakeholder = await this._session
      .getDB()(this._tableName)
      .select('*')
      .where('id', id)
      .first();

    stakeholder.children = await this.getChildren(id);
    stakeholder.parents = await this.getParents(id);
    return stakeholder;
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

    if (childrenIds.length) {
      const arr = childrenIds.map((child) => child.relation_id);

      return this._session
        .getDB()(this._tableName)
        .select('*')
        .where((builder) => builder.whereIn('id', arr));
    }
    return [];
  }
}

module.exports = StakeholderRepository;
