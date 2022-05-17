const expect = require('expect-runtime');
const BaseRepository = require('./BaseRepository');

class StakeholderRepository extends BaseRepository {
  constructor(session) {
    super('stakeholder', session);
    this._tableName = 'stakeholder';
    this._session = session;
  }

  // RETURNS A FLAT LIST OF RELATED ORGS FROM OLD TABLE
  async getStakeholderByOrganizationId(
    organization_id,
    options = { limit: 100, offset: 0 },
  ) {
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

  // async getUUIDbyId(id) {
  //   return this._session
  //     .getDB()(this._tableName)
  //     .select('id')
  //     .where('organization_id', id)
  //     .first();
  // }

  async getById(id) {
    return this._session
      .getDB()(this._tableName)
      .select('*')
      .where('id', id)
      .first();
  }

  async getAllStakeholders(limitOptions) {
    // get only non-children to start building trees
    let promise = this._session
      .getDB()('stakeholder as s')
      .select(
        's.id',
        's.type',
        's.org_name',
        's.first_name',
        's.last_name',
        's.email',
        's.phone',
        's.website',
        's.logo_url',
        's.map',
      )
      .leftJoin('stakeholder_relation as sr', 's.id', 'sr.child_id')
      .whereNull('sr.child_id')
      .andWhere('active', true)
      .orderBy('s.org_name', 'asc');

    if (limitOptions?.limit) {
      promise = promise.limit(limitOptions.limit);
    }
    if (limitOptions?.offset) {
      promise = promise.limit(limitOptions.offset);
    }

    const stakeholders = await promise;

    // count all the stakeholders, regardless of nesting
    const count = await this._session.getDB()('stakeholder as s').count('*');

    // // add these lines to count only the parents and not the children:
    // .leftJoin('stakeholder_relation as sr', 's.id', 'sr.child_id')
    // .whereNull('sr.child_id');

    return { stakeholders, count: +count[0].count };
  }

  async getAllStakeholdersById(id = null, limitOptions) {
    // get only non-children to start building trees
    let promise = this._session
      .getDB()('stakeholder as s')
      .select(
        's.id',
        's.type',
        's.org_name',
        's.first_name',
        's.last_name',
        's.email',
        's.phone',
        's.website',
        's.logo_url',
        's.map',
      )
      .leftJoin('stakeholder_relation as sr', 's.id', 'sr.child_id')
      .where('s.id', id)
      .andWhere('active', true)
      .orderBy('s.org_name', 'asc');

    if (limitOptions?.limit) {
      promise = promise.limit(limitOptions.limit);
    }
    if (limitOptions?.offset) {
      promise = promise.limit(limitOptions.offset);
    }

    const stakeholders = await promise;

    // count all the stakeholders, regardless of nesting
    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where('id', id)
      .andWhere('active', true);

    return { stakeholders, count: +count[0].count };
  }

  // not currently being used but may be useful later
  async getStakeholderTreeById(id = null) {
    const stakeholder = await this._session
      .getDB()(this._tableName)
      .select(
        'id',
        'type',
        'org_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'website',
        'logo_url',
        'map',
      )
      .where('id', id)
      .andWhere('active', true)
      .first();

    // only get one step generation difference, no recursion
    stakeholder.parents = await this.getParents(stakeholder);
    stakeholder.children = await this.getChildren(stakeholder);

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where('id', id)
      .andWhere('active', true);

    return {
      stakeholders: [stakeholder],
      count: count ? +count[0].count : 0,
    };
  }

  async getParentIds(id) {
    const parents = await this._session
      .getDB()('stakeholder as s')
      .select('sr.parent_id')
      .join('stakeholder_relation as sr', 's.id', 'sr.child_id')
      .where('s.id', id);

    return parents.length ? parents.map((parent) => parent.parent_id) : [];
  }

  async getParents(child) {
    const parentIds = await this.getParentIds(child.id);

    if (parentIds.length) {
      return this._session
        .getDB()(this._tableName)
        .select(
          'id',
          'type',
          'org_name',
          'first_name',
          'last_name',
          'email',
          'phone',
          'website',
          'logo_url',
          'map',
        )
        .whereIn('id', parentIds)
        .andWhere('active', true)
        .orderBy('org_name', 'asc');
    }
    return [];
  }

  async getChildrenIds(id) {
    const children = await this._session
      .getDB()('stakeholder as s')
      .select('sr.child_id')
      .join('stakeholder_relation as sr', 's.id', 'sr.parent_id')
      .where('s.id', id);

    return children.length ? children.map((child) => child.child_id) : [];
  }

  async getChildren(parent) {
    const childrenIds = await this.getChildrenIds(parent.id);
    const childrenFound = [...new Set(childrenIds)];

    if (childrenIds.length) {
      return this._session
        .getDB()(this._tableName)
        .select(
          'id',
          'type',
          'org_name',
          'first_name',
          'last_name',
          'email',
          'phone',
          'website',
          'logo_url',
          'map',
        )
        .whereIn('id', childrenFound)
        .andWhere('active', true)
        .orderBy('org_name', 'asc');
    }
    return [];
  }

  async getFilter(filter, limitOptions) {
    const whereBuilder = (object, builder) => {
      const { search = '', org_name = '', ...rest } = object;
      const result = builder;
      result.where({ ...rest }).andWhere('org_name', 'ilike', `%${org_name}%`);
      result.andWhere(function () {
        if (search) {
          this.where('org_name', 'ilike', `%${search}%`);
          this.orWhere('first_name', 'ilike', `%${search}%`);
          this.orWhere('last_name', 'ilike', `%${search}%`);
          this.orWhere('email', 'ilike', `%${search}%`);
          this.orWhere('phone', 'ilike', `%${search}%`);
          this.orWhere('website', 'ilike', `%${search}%`);
          this.orWhere('map', 'ilike', `%${search}%`);
        }
      });

      return result;
    };

    let promise = this._session
      .getDB()(this._tableName)
      .select(
        'id',
        'type',
        'org_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'website',
        'logo_url',
        'map',
      )
      .where((builder) => whereBuilder(filter, builder))
      .andWhere('active', true)
      .orderBy('org_name', 'asc');

    if (limitOptions?.limit) {
      promise = promise.limit(limitOptions.limit);
    }
    if (limitOptions?.offset) {
      promise = promise.limit(limitOptions.offset);
    }

    const stakeholders = await promise;

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where((builder) => whereBuilder(filter, builder))
      .andWhere('active', true);

    return { stakeholders, count: +count[0].count };
  }

  async getFilterById(id, filter, limitOptions) {
    const relatedIds = await this.getRelatedIds(id);

    let promise = this._session
      .getDB()(this._tableName)
      .select(
        'id',
        'type',
        'org_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'website',
        'logo_url',
        'map',
      )
      .where((builder) => builder.whereIn('id', relatedIds))
      .andWhere({ ...filter })
      .andWhere('active', true)
      .orderBy('org_name', 'asc');

    if (limitOptions?.limit) {
      promise = promise.limit(limitOptions.limit);
    }
    if (limitOptions?.offset) {
      promise = promise.limit(limitOptions.offset);
    }

    const stakeholders = promise;

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .where((builder) => builder.whereIn('id', relatedIds))
      .andWhere({ ...filter })
      .andWhere('active', true);

    return { stakeholders, count: +count[0].count };
  }

  async createStakeholder(stakeholder) {
    const created = await this._session
      .getDB()(this._tableName)
      .insert(stakeholder)
      .returning('*');

    expect(created).match([
      {
        id: expect.anything(),
      },
    ]);

    return created[0];
  }

  async deleteStakeholder(id) {
    const deleted = await this._session
      .getDB()(this._tableName)
      .where('id', id)
      .update('active', false)
      .returning('*');

    expect(deleted).match([
      {
        id: expect.anything(),
      },
    ]);

    return deleted[0];
  }

  async updateStakeholder(stakeholder) {
    const updated = await this._session
      .getDB()(this._tableName)
      .where('id', stakeholder.id)
      .update(stakeholder, ['*']);

    expect(updated).match([
      {
        id: expect.anything(),
      },
    ]);

    return updated[0];
  }

  async getRelatedIds(id) {
    const relatedIds = await this._session
      .getDB()('stakeholder as s')
      .select('sr.child_id', 'sr.parent_id')
      .join('stakeholder_relation as sr', function () {
        this.on(function () {
          this.on('s.id', 'sr.child_id');
          this.orOn('s.id', 'sr.parent_id');
        });
      })
      .where('s.id', id);

    // get rid of duplicates
    const ids = new Set();
    relatedIds.forEach((stakeholder) => {
      ids.add(stakeholder.parent_id);
      ids.add(stakeholder.child_id);
    });

    return Array.from(ids);
  }

  async getRelations(id) {
    const relatedIds = await this.getRelatedIds(id);
    const ids = relatedIds || [];

    const stakeholders = await this._session
      .getDB()(this._tableName)
      .select(
        'id',
        'type',
        'org_name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'website',
        'logo_url',
        'map',
      )
      .whereIn('id', [...ids, id])
      .andWhere('active', true)
      .orWhereNull('id')
      .orderBy('org_name', 'asc');

    const count = await this._session
      .getDB()(this._tableName)
      .count('*')
      .whereIn('id', [...ids, id])
      .andWhere('active', true);

    return { stakeholders, count: +count[0].count };
  }

  // KEEP IN CASE WE NEED TO ADD BACK
  // async getNonRelations(id, owner_id) {
  //   const relatedIds = await this.getRelatedIds(id);
  //   const ids = relatedIds || [];

  //   const stakeholders = await this._session
  //     .getDB()(this._tableName)
  //     .select('*')
  //     .whereIn('owner_id', [id, owner_id])
  //     .orWhereNull('owner_id')
  //     .whereNotIn('id', [...ids, id])
  //     .orderBy('org_name', 'asc');

  //   const count = await this._session
  //     .getDB()(this._tableName)
  //     .count('*')
  //     .whereNotIn('id', [...ids, id]);

  //   return { stakeholders, count: +count[0].count };
  // }

  async createRelation(relationData) {
    const linkedStakeholders = await this._session
      .getDB()('stakeholder_relation')
      .insert(relationData)
      .returning('*');

    expect(linkedStakeholders[0]).to.have.property('parent_id');

    return linkedStakeholders[0];
  }

  async deleteRelation(relationData) {
    const linkedStakeholders = await this._session
      .getDB()('stakeholder_relation')
      .where(relationData)
      .del()
      .returning('*');

    expect(linkedStakeholders).to.match([
      {
        parent_id: expect.anything(),
      },
    ]);

    return linkedStakeholders[0];
  }
}

module.exports = StakeholderRepository;
