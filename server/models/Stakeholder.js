/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */

const StakeholderPostObject = ({
  type,
  org_name,
  first_name,
  last_name,
  email,
  phone,
  website,
  logo_url,
  map,
}) => {
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
};

const StakeholderTree = ({
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
}) => {
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
};

const FilterCriteria = ({
  id = null,
  type = null,
  org_name = null,
  first_name = null,
  last_name = null,
  image_url = null,
  email = null,
  phone = null,
  website = null,
  logo_url = null,
  map = null,
  search = null,
}) => {
  return Object.entries({
    id,
    type,
    org_name,
    first_name,
    last_name,
    image_url,
    email,
    phone,
    website,
    logo_url,
    map,
    search,
  })
    .filter(
      (entry) => entry[1] !== undefined && entry[1] !== null && entry[1] !== '',
    )
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const createRelation = (repo, org_id) => async (stakeholder) => {
  // eslint-disable-next-line no-use-before-define
  const id = await getUUID(repo, org_id);
  const { type, data } = stakeholder;
  const insertObj = {};

  if (type === 'parents' || type === 'children') {
    // assign parent and child ids, but if the id is null, look for the relation_id on the data
    insertObj.parent_id = type === 'parents' ? data.id : id || data.relation_id;
    insertObj.child_id = type === 'children' ? data.id : id || data.relation_id;
  }

  const stakeholderRelation = await repo.createRelation(insertObj);

  return stakeholderRelation;
};

async function getUUIDbyId(repo, id, options = { limit: 100, offset: 0 }) {
  // get organization from old entity table
  const { stakeholders } = await repo.getStakeholderByOrganizationId(
    id,
    options,
  );

  const org_id = stakeholders[0].stakeholder_uuid;
  const exists = await repo.getById(org_id);

  if (!exists) {
    const updates = stakeholders.map(async (entity, i) => {
      const foundStakeholder = await repo.getById(entity.stakeholder_uuid);
      const executeCreateRelation = createRelation(repo, org_id);

      if (!foundStakeholder) {
        // console.log('entity to create', entity);
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

        const stakeholder = await repo.createStakeholder(stakeholderObj);

        if (i > 0) {
          // if there are relations, create links
          await executeCreateRelation({
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

async function getUUID(repo, org_id) {
  const orgId = Number(org_id);
  // get organization from old entity table
  return org_id === null || Number.isNaN(orgId)
    ? org_id
    : getUUIDbyId(repo, orgId);
}

const getRelationTrees = async (stakeholders, repo) =>
  Promise.all(
    stakeholders.map(async (stakeholder) => {
      const parents = await repo.getParents(stakeholder);
      // don't want to keep getting all of the parents and children recursively, but do want to
      // include the current stakeholder as parent/child

      stakeholder.parents = parents.map((parent) => {
        parent.parents = [];
        parent.children = [{ ...stakeholder }];
        return parent;
      });

      const children = await repo.getChildren(stakeholder);

      stakeholder.children = children.map((child) => {
        child.parents = [{ ...stakeholder }];
        child.children = [];
        return child;
      });

      return stakeholder;
    }),
  );

const getAllStakeholders =
  (repo) =>
  async ({ filter: { where }, ...idFilters } = undefined) => {
    const filter = FilterCriteria({ ...idFilters, ...where });
    let dbStakeholders;
    let count;

    if (Object.keys(filter).length > 0) {
      const { stakeholders, count: dbCount } = await repo.getFilter(filter);

      dbStakeholders = stakeholders;
      count = dbCount;
    } else {
      const { stakeholders, count: dbCount } = await repo.getAllStakeholders();
      dbStakeholders = stakeholders;
      count = dbCount;
    }

    const stakeholders = await getRelationTrees(dbStakeholders, repo);

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return StakeholderTree({ ...row });
        }),
      totalCount: count,
    };
  };

const getAllStakeholdersById =
  (repo, org_id) =>
  async ({ filter: { where }, ...idFilters } = undefined) => {
    const filter = FilterCriteria({ ...idFilters, ...where });
    const id = await getUUID(repo, org_id);

    let dbStakeholders;
    let count = 0;

    if (Object.keys(filter).length > 0) {
      const { stakeholders, count: dbCount } = await repo.getFilterById(
        id,
        filter,
      );
      dbStakeholders = stakeholders;
      count = dbCount;
    } else {
      const { stakeholders, count: dbCount } =
        await repo.getAllStakeholdersById(id);
      dbStakeholders = stakeholders;
      count = dbCount;
    }

    const stakeholders = await getRelationTrees(dbStakeholders, repo);

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return StakeholderTree({ ...row });
        }),
      totalCount: count,
    };
  };

const getRelations = (repo, current_id) => async () => {
  const { stakeholders, count } = await repo.getRelations(current_id);

  return {
    stakeholders:
      stakeholders &&
      stakeholders.map((row) => {
        row.children = [];
        row.parents = [];
        return StakeholderTree({ ...row });
      }),
    totalCount: count,
  };
};

// SAVE IN CASE WE NEED TO ADD AGAIN
// const getNonRelations = (repo, current_id) => async (org_id) => {
//   const id = await getUUID(repo, org_id);
//   const { stakeholders, count } = await repo.getNonRelations(current_id, id);

//   return {
//     stakeholders:
//       stakeholders &&
//       stakeholders.map((row) => {
//         row.children = [];
//         row.parents = [];
//         return StakeholderTree({ ...row });
//       }),
//     totalCount: count,
//   };
// };

const deleteRelation = (repo, current_id) => async (stakeholder) => {
  const id = await getUUID(repo, current_id);
  const { type, data } = stakeholder;
  const removeObj = {};

  if (type === 'parents' || type === 'children') {
    removeObj.parent_id = type === 'parents' ? data.id : id;
    removeObj.child_id = type === 'children' ? data.id : id;
  }

  const stakeholderRelation = await repo.deleteRelation(removeObj);

  return stakeholderRelation;
};

const updateStakeholder = (repo) => async (data) => {
  const editedStakeholder = StakeholderTree({ ...data });

  // remove children and parents temporarily to update
  const { children, parents, ...updateObj } = editedStakeholder;
  const stakeholder = await repo.updateStakeholder(updateObj);

  return StakeholderTree({ ...stakeholder, children, parents });
};

const createStakeholder =
  (repo, org_id = null) =>
  async (newStakeholder) => {
    const id = await getUUID(repo, org_id);
    const stakeholderObj = StakeholderPostObject({ ...newStakeholder });

    const stakeholder = await repo.createStakeholder(stakeholderObj, id);

    return StakeholderTree({ ...stakeholder });
  };

const deleteStakeholder = (repo) => async (removeStakeholder) => {
  const stakeholder = await repo.deleteStakeholder(removeStakeholder);

  return StakeholderTree({ ...stakeholder });
};

module.exports = {
  getAllStakeholdersById,
  getAllStakeholders,
  createStakeholder,
  deleteStakeholder,
  updateStakeholder,
  getRelations,
  // getNonRelations,
  createRelation,
  deleteRelation,
  StakeholderTree,
  FilterCriteria,
};
