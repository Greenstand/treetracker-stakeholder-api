const StakeholderRepository = require('../repositories/StakeholderRepository');

class Stakeholder {
  constructor(session) {
    this._stakeholderRepository = new StakeholderRepository(session);
  }

  static StakeholderPostObject({
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    website,
    logo_url,
    map,
  }) {
    return Object.freeze({
      type,
      org_name,
      first_name,
      last_name,
      email,
      phone,
      website,
      logo_url,
      map,
    });
  }

  static StakeholderTree({
    id,
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    website,
    logo_url,
    map,
    children = [],
    parents = [],
  }) {
    return Object.freeze({
      id,
      type,
      org_name,
      first_name,
      last_name,
      email,
      phone,
      website,
      logo_url,
      map,
      children,
      parents,
    });
  }

  stakeholderTree(object) {
    return this.constructor.StakeholderTree(object);
  }

  async createRelation(org_id, stakeholder) {
    const id = await this.getUUID(org_id);
    const { type, data } = stakeholder;
    const insertObj = {};

    if (type === 'parents' || type === 'children') {
      // assign parent and child ids, but if the id is null, look for the relation_id on the data
      insertObj.parent_id =
        type === 'parents' ? data.id : id || data.relation_id;
      insertObj.child_id =
        type === 'children' ? data.id : id || data.relation_id;
    }

    const stakeholderRelation =
      await this._stakeholderRepository.createRelation(insertObj);

    return stakeholderRelation;
  }

  async getUUIDbyId(id) {
    // get organization from old entity table
    const { stakeholders } =
      await this._stakeholderRepository.getStakeholderByOrganizationId(id);

    const org_id = stakeholders[0].stakeholder_uuid;
    const exists = await this._stakeholderRepository.getById(org_id);

    if (!exists) {
      const updates = stakeholders.map(async (entity, i) => {
        const foundStakeholder = await this._stakeholderRepository.getById(
          entity.stakeholder_uuid,
        );

        if (!foundStakeholder) {
          // map from entity fields to stakeholder fields
          const stakeholderObj = {
            id: entity.stakeholder_uuid,
            type: entity.type === 'O' ? 'Organization' : 'Person',
            org_name: entity.name,
            first_name: entity.first_name,
            last_name: entity.last_name,
            email: entity.email,
            phone: entity.phone,
            logo_url: entity.logo_url,
            map: entity.map_name,
            website: entity.website,
          };

          const stakeholder =
            await this._stakeholderRepository.createStakeholder(stakeholderObj);

          if (i > 0) {
            // if there are relations, create links
            await this.createRelation(org_id, {
              type: 'children',
              data: stakeholder,
            });
          }
        }
      });
      await Promise.all(updates);
    }

    return org_id;
  }

  async getUUID(org_id) {
    const orgId = +org_id;
    // get organization from old entity table
    return orgId ? this.getUUIDbyId(orgId) : org_id;
  }

  async getRelationTrees(stakeholders) {
    return Promise.all(
      stakeholders.map(async (stakeholder) => {
        const stakeholderCopy = { ...stakeholder };
        const parents = await this._stakeholderRepository.getParents(
          stakeholderCopy,
        );
        // don't want to keep getting all of the parents and children recursively, but do want to
        // include the current stakeholder as parent/child

        stakeholderCopy.parents = parents.map((parent) => {
          const parentCopy = { ...parent };
          parentCopy.parents = [];
          parentCopy.children = [{ ...stakeholderCopy }];
          return parentCopy;
        });

        const children = await this._stakeholderRepository.getChildren(
          stakeholderCopy,
        );

        stakeholderCopy.children = children.map((child) => {
          const childCopy = { ...child };
          childCopy.parents = [{ ...stakeholderCopy }];
          childCopy.children = [];
          return childCopy;
        });

        return stakeholderCopy;
      }),
    );
  }

  async getAllStakeholders(filter, limitOptions) {
    let dbStakeholders;
    let count;

    if (filter && Object.keys(filter).length > 0) {
      const { stakeholders, count: dbCount } =
        await this._stakeholderRepository.getFilter(filter, limitOptions);

      dbStakeholders = stakeholders;
      count = dbCount;
    } else {
      const { stakeholders, count: dbCount } =
        await this._stakeholderRepository.getAllStakeholders(limitOptions);
      dbStakeholders = stakeholders;
      count = dbCount;
    }

    const stakeholders = await this.getRelationTrees(dbStakeholders);

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return this.stakeholderTree({ ...row });
        }),
      totalCount: count,
    };
  }

  async getAllStakeholdersById(org_id, filter, limitOptions) {
    const id = await this.getUUID(org_id);

    let dbStakeholders;
    let count = 0;

    if (filter && Object.keys(filter).length > 0) {
      const { stakeholders, count: dbCount } =
        await this._stakeholderRepository.getFilterById(
          id,
          filter,
          limitOptions,
        );
      dbStakeholders = stakeholders;
      count = dbCount;
    } else {
      const { stakeholders, count: dbCount } =
        await this._stakeholderRepository.getAllStakeholdersById(
          id,
          limitOptions,
        );
      dbStakeholders = stakeholders;
      count = dbCount;
    }

    const stakeholders = await this.getRelationTrees(dbStakeholders);

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return this.stakeholderTree({ ...row });
        }),
      totalCount: count,
    };
  }

  async getRelations(id) {
    const { stakeholders, count } =
      await this._stakeholderRepository.getRelations(id);

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          const rowCopy = { ...row };
          rowCopy.children = [];
          rowCopy.parents = [];
          return this.stakeholderTree({ ...rowCopy });
        }),
      totalCount: count,
    };
  }

  async deleteRelation(current_id, data) {
    const id = await this.getUUID(current_id);
    const { type, relation_id } = data;
    const removeObj = {};

    if (type === 'parents' || type === 'children') {
      removeObj.parent_id = type === 'parents' ? relation_id : id;
      removeObj.child_id = type === 'children' ? relation_id : id;
    }

    const stakeholderRelation =
      await this._stakeholderRepository.deleteRelation(removeObj);

    return stakeholderRelation;
  }

  async updateStakeholder(data) {
    const editedStakeholder = this.stakeholderTree({ ...data });

    // remove children and parents temporarily to update
    const { children, parents, ...updateObj } = editedStakeholder;
    const stakeholder = await this._stakeholderRepository.updateStakeholder(
      updateObj,
    );

    return this.stakeholderTree({ ...stakeholder, children, parents });
  }

  async createStakeholder(data) {
    const stakeholderObj = this.constructor.StakeholderPostObject(data);

    const stakeholder = await this._stakeholderRepository.createStakeholder(
      stakeholderObj,
    );

    return this.stakeholderTree({ ...stakeholder });
  }

  async deleteStakeholder(id) {
    const stakeholder = await this._stakeholderRepository.deleteStakeholder(id);

    return this.stakeholderTree({ ...stakeholder });
  }

  // SAVE IN CASE WE NEED TO ADD AGAIN
  // async getNonRelations(current_id, org_id) {
  //   const id = await this.getUUID(org_id);
  //   const { stakeholders, count } =
  //     await this._stakeholderRepository.getNonRelations(current_id, id);

  //   return {
  //     stakeholders:
  //       stakeholders &&
  //       stakeholders.map((row) => {
  //         row.children = [];
  //         row.parents = [];
  //         return this.stakeholderTree({ ...row });
  //       }),
  //     totalCount: count,
  //   };
  // }
}

module.exports = Stakeholder;
