const expect = require('expect-runtime');
const BaseRepository = require('./BaseRepository');

class StakeholderRepository extends BaseRepository {
  constructor(session) {
    super('stakeholder', session);
    this._tableName = 'stakeholder';
    this._session = session;
  }

  async getAllStakeholders(options) {
    const stakeholders = this._session
      .getDB()(this._tableName)
      .select('*')
      .orderBy('org_name', 'asc')
      .limit(options.limit)
      .offset(options.offset);

    const count = await this._session.getDB()(this._tableName).count('*');

    return { stakeholders, count: +count[0].count };
  }

  async getStakeholderById(id) {
    let stakeholder_uuid = null;
    let stakeholder_id = null;
    if (Number.isInteger(id)) {
      stakeholder_id = id;
    } else {
      stakeholder_uuid = id;
    }

    const stakeholder = await this._session
      .getDB()(this._tableName)
      .select('*')
      .where('id', '=', stakeholder_id)
      .orWhere('stakeholder_uuid', '=', stakeholder_uuid)
      .first();

    return { stakeholder };
  }

  async getAllStakeholderTrees(options) {
    // get only non-child to start building trees
    const results = await this._session
      .getDB()('stakeholder as s')
      .select('s.*')
      .leftJoin(
        'stakeholder_relations as sr',
        'stakeholder_uuid',
        'sr.child_id',
      )
      .where('sr.child_id', null)
      .orderBy('org_name', 'asc')
      .limit(options.limit)
      .offset(options.offset);

    const stakeholders = await Promise.all(
      results.map(async (stakeholder) => {
        // eslint-disable-next-line no-param-reassign
        stakeholder.parents = await this.getParents(
          stakeholder.stakeholder_uuid,
        );
        // eslint-disable-next-line no-param-reassign
        stakeholder.children = await this.getChildren(stakeholder, options);
        return stakeholder;
      }),
    );

    // count all the stakeholder whether parent or child?
    const count = await this._session.getDB()(this._tableName).count('*');

    return { stakeholders, count: +count[0].count };
  }

  async getStakeholderTreeById(id, options) {
    console.log('GET STAKEHOLDER BY ID', id, options);
    let stakeholder_uuid = null;
    let stakeholder_id = null;
    if (Number.isInteger(id)) {
      stakeholder_id = id;
    } else {
      stakeholder_uuid = id;
    }

    const stakeholder = await this._session
      .getDB()(this._tableName)
      .select('*')
      .where('id', '=', stakeholder_id)
      .orWhere('stakeholder_uuid', '=', stakeholder_uuid)
      .first();

    stakeholder.parents = await this.getParents(stakeholder.stakeholder_uuid);
    stakeholder.children = await this.getChildren(stakeholder, options);

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where('id', id)
      .orWhere('stakeholder_uuid', stakeholder_uuid);

    return { stakeholders: [stakeholder], count: +count[0].count };
  }

  async getParentIds(id) {
    const parents = await this._session
      .getDB()(this._tableName)
      .select('stakeholder_relations.parent_id')
      .join(
        'stakeholder_relations',
        'stakeholder_uuid',
        'stakeholder_relations.child_id',
      )
      .where('stakeholder_uuid', id);

    return parents ? parents.map((parent) => parent.parent_id) : [];
  }

  async getParents(id) {
    const parentIds = await this.getParentIds(id);

    if (parentIds.length) {
      return this._session
        .getDB()(this._tableName)
        .select('*')
        .whereIn('stakeholder_uuid', parentIds);
    }

    return [];
  }

  async getChildrenIds(id) {
    const children = await this._session
      .getDB()(this._tableName)
      .select('stakeholder_relations.child_id')
      .join(
        'stakeholder_relations',
        'stakeholder_uuid',
        'stakeholder_relations.parent_id',
      )
      .where('stakeholder_uuid', id);

    return children ? children.map((child) => child.child_id) : [];
  }

  async getChildren(parent, options) {
    const childrenIds = await this.getChildrenIds(parent.stakeholder_uuid);

    if (childrenIds.length) {
      const children = await this._session
        .getDB()(this._tableName)
        .select('*')
        .whereIn('stakeholder_uuid', childrenIds)
        .orderBy('org_name', 'asc')
        .limit(options.limit)
        .offset(options.offset);

      // don't want to keep getting all of the parents and children recursively, but do want to
      // include the current stakeholder as parent
      return children.map((child) => {
        // eslint-disable-next-line no-param-reassign
        child.parents = [{ ...parent }];
        return child;
      });
    }
    return [];
  }

  async getFilter(filter, options) {
    const results = await this._session
      .getDB()(this._tableName)
      .select('*')
      .where({ ...filter })
      .orderBy('org_name', 'asc')
      .limit(options.limit)
      .offset(options.offset);

    const stakeholders = await Promise.all(
      results.map(async (stakeholder) => {
        // eslint-disable-next-line no-param-reassign
        stakeholder.parents = await this.getParents(
          stakeholder.stakeholder_uuid,
        );
        // eslint-disable-next-line no-param-reassign
        stakeholder.children = await this.getChildren(stakeholder, options);
        return stakeholder;
      }),
    );

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where({ ...filter });

    return { stakeholders, count: +count[0].count };
  }

  async getRelatedIds(id) {
    let stakeholder_uuid = null;
    let stakeholder_id = null;
    if (Number.isInteger(id)) {
      stakeholder_id = id;
    } else {
      stakeholder_uuid = id;
    }

    const relatedIds = await this._session
      .getDB()('stakeholder as s')
      .select('sr.child_id', 'sr.parent_id')
      .join('stakeholder_relations as sr', function () {
        this.on(function () {
          this.on('stakeholder_uuid', '=', 'sr.child_id');
          this.orOn('stakeholder_uuid', '=', 'sr.parent_id');
        });
      })
      .where('s.stakeholder_uuid', stakeholder_uuid)
      .orWhere('s.id', stakeholder_id);

    const ids = new Set();
    relatedIds.forEach((stakeholder) => {
      ids.add(stakeholder.parent_id);
      ids.add(stakeholder.child_id);
    });

    return Array.from(ids);
  }

  async getFilterById(id, filter, options) {
    console.log('GET BY ID FILTER', id, filter, options);
    const { org_name, first_name, last_name, email, phone, ...otherFilters } =
      filter;
    const relatedIds = await this.getRelatedIds(id);

    console.log(
      'filter cols -------->',
      org_name,
      first_name,
      last_name,
      email,
      phone,
    );
    console.log('other filters -------->', otherFilters);

    const stakeholders = await this._session
      .getDB()(this._tableName)
      .select('*')
      .whereIn('stakeholder_uuid', relatedIds)
      .andWhere({ ...otherFilters })
      .andWhere(
        (builder) =>
          builder.where('org_name', 'like', org_name ? org_name.regexp : null),
        // .orWhere('first_name', 'like', first_name.regexp)
        // .orWhere('last_name', 'like', last_name.regexp)
        // .orWhere('email', 'like', email.regexp)
        // .orWhere('phone', 'like', phone.regexp),
      )
      .orderBy('org_name', 'asc')
      .limit(options.limit)
      .offset(options.offset);

    console.log('stakeholders -------->', stakeholders);

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .whereIn('stakeholder_uuid', relatedIds)
      .andWhere({ ...otherFilters })
      .andWhere(
        (builder) => builder.where('org_name', 'like', org_name.regexp),
        // .orWhere('first_name', 'like', first_name.regexp)
        // .orWhere('last_name', 'like', last_name.regexp)
        // .orWhere('email', 'like', email.regexp)
        // .orWhere('phone', 'like', phone.regexp),
      );

    return { stakeholders, count: +count[0].count };
  }

  async createStakeholder(id, object) {
    const created = await this._session
      .getDB()(this._tableName)
      .insert(object)
      .returning('*');

    expect(created).match([
      {
        id: expect.anything(),
      },
    ]);

    const linked = this.linkStakeholder(id, object.id);
    expect(linked).match([
      {
        id: expect.uuid(),
      },
    ]);

    return created[0];
  }

  async updateStakeholder(id, object) {
    const updated = await this._session
      .getDB()(this._tableName)
      .where('id', object.id)
      .update(object, ['*']);

    expect(updated).match([
      {
        id: expect.anything(),
      },
    ]);

    return updated[0];
  }

  async linkStakeholder(id, relation, linkId) {
    const relationObj = {};
    relation.parent_id = relation === 'parent' ? linkId : id;
    relation.child_id = relation === 'child' ? linkId : id;

    console.log('relationObj', relationObj);

    const linked = this._session
      .getDB()('stakeholder_relations')
      .insert(relationObj)
      .returning('*');

    expect(linked).match([
      {
        id: expect.uuid(),
      },
    ]);

    return linked[0];
  }
}

module.exports = StakeholderRepository;
