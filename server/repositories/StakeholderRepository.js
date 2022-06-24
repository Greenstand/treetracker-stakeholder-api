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

  async getByFilter(filter, limitOptions, id) {
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

    let query = this._session
      .getDB()
      .from(`${this._tableName} as s`)
      .where('active', true);

    if (filter && Object.keys(filter).length) {
      // getStakeholders with filter
      query.andWhere((builder) => whereBuilder(filter, builder));
      // getStakeholders with filter and id
      if (id) {
        const relatedIds = await this.getRelatedIds(id);
        query.andWhere((builder) => builder.whereIn('id', relatedIds));
      }
    } else if (id) {
      // getAllStakeholdersById without filters
      query
        .leftJoin('stakeholder_relation as sr', 's.id', 'sr.child_id')
        .andWhere('s.id', id);
    } else {
      // getAllStakeholders without filters
      query
        .leftJoin('stakeholder_relation as sr', 's.id', 'sr.child_id')
        .whereNull('sr.child_id');
    }

    if (limitOptions?.limit) {
      query = query.limit(limitOptions.limit);
    }
    if (limitOptions?.offset) {
      query = query.offset(limitOptions.offset);
    }

    const stakeholders = await query
      .clone()
      .select(
        this._session.getDB().raw(`
              s.id,
              s.type,
              s.org_name,
              s.first_name,
              s.last_name,
              s.email,
              s.phone,
              s.website,
              s.logo_url,
              s.map,
              (
                select coalesce(json_agg(
                  json_build_object(
                    'id', id, 
                    'type', type,
                    'org_name', org_name,
                    'first_name', first_name,
                    'last_name', last_name,
                    'email', email,
                    'phone', phone,
                    'website', website,
                    'logo_url', logo_url,
                    'map', map
                  )
                ), '[]'::json)
                from stakeholder st
                where st.id in (
                  select sr.parent_id
                  from stakeholder st2
                  join stakeholder_relation sr on st2.id = sr.child_id
                  where st2.id = s.id
                ) and active = true
              ) parents,
              (
                select coalesce(json_agg(
                  json_build_object(
                    'id', id, 
                    'type', type,
                    'org_name', org_name,
                    'first_name', first_name,
                    'last_name', last_name,
                    'email', email,
                    'phone', phone,
                    'website', website,
                    'logo_url', logo_url,
                    'map', map
                  )
                ), '[]'::json)
                from stakeholder st
                where st.id in (
                  select distinct sr.child_id
                  from stakeholder st2
                  join stakeholder_relation sr on st2.id = sr.parent_id
                  where st2.id = s.id
                ) and active = true
              ) children
          `),
      )
      .orderBy('s.org_name', 'asc');

    const count = await query.clone().count();

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
