/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { v4: uuidv4 } = require('uuid');

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
  // pwd_reset_required,
  // password,
  // wallet,
  // salt,
  // active_contract_id,
  // offering_pay_to_plant,
  // tree_validation_contract_id,
  // organization_id,
  // owner_id,
}) => {
  return Object.freeze({
    id: uuidv4(), // give it a uuid,
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    website,
    logo_url,
    map,
    // pwd_reset_required: pwd_reset_required || false,
    // password,
    // wallet,
    // salt,
    // active_contract_id: active_contract_id || null,
    // offering_pay_to_plant,
    // tree_validation_contract_id: tree_validation_contract_id || null,
    // organization_id,
    // owner_id,
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
  // pwd_reset_required,
  // password,
  // wallet,
  // salt,
  // active_contract_id,
  // offering_pay_to_plant,
  // tree_validation_contract_id,
  // organization_id,
  // owner_id,
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
    // pwd_reset_required,
    // password,
    // wallet,
    // salt,
    // active_contract_id,
    // offering_pay_to_plant,
    // tree_validation_contract_id,
    // organization_id,
    // owner_id,
    children,
    parents,
  });
};

const FilterCriteria = ({
  id = null,
  // owner_id = null,
  // organization_id = null,
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
    // owner_id,
    // organization_id,
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

const QueryOptions = ({ limit = undefined, offset = undefined }) => {
  return Object.entries({ limit, offset })
    .filter((entry) => entry[1] !== undefined)
    .reduce((result, item) => {
      result[item[0]] = item[1];
      return result;
    }, {});
};

const makeNextPrevUrls = (url, filter, options) => {
  const queryFilterObjects = { ...filter };
  queryFilterObjects.limit = options.limit;
  // remove offset property, as it is calculated later
  delete queryFilterObjects.offset;

  const query = Object.keys(queryFilterObjects)
    .map((key) => `${key}=${encodeURIComponent(queryFilterObjects[key])}`)
    .join('&');
  const urlWithLimitAndOffset = `${url}?${query}&offset=`;

  const next = `${urlWithLimitAndOffset}${+options.offset + +options.limit}`;

  let prev = null;
  if (options.offset - +options.limit >= 0) {
    prev = `${urlWithLimitAndOffset}${+options.offset - +options.limit}`;
  }

  return { next, prev };
};

const createRelation = (repo, org_id) => async (stakeholder) => {
  const id = await getUUID(repo, org_id);

  // check both stakeholders exist
  // const current = await repo.getById(id);
  // const newRelation = await repo.getById(stakeholder.data.id);

  // confirm there's permission to create
  // note: owners should have their own id as owner_id
  // if (
  // newRelation.owner_id === id ||
  // current.owner_id === newRelation.owner_id ||
  //   id === null ||
  //   newRelation.owner_id === null
  // ) {
  const { type, data } = stakeholder;
  const insertObj = {};

  if (type === 'parents' || type === 'children') {
    // assign parent and child ids, but if the id is null, look for the relation_id on the data
    insertObj.parent_id = type === 'parents' ? data.id : id || data.relation_id;
    insertObj.child_id = type === 'children' ? data.id : id || data.relation_id;
  }

  const stakeholderRelation = await repo.createRelation(insertObj);

  return stakeholderRelation;
  // }
  // throw new Error({
  //   message: "Whoops! That stakeholder link can't be updated, no permission",
  // });
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
          // pwd_reset_required: entity.pwd_reset_required,
          // password: entity.password,
          // wallet: entity.wallet,
          // salt: entity.salt,
          // active_contract_id: entity.active_contract_id,
          // offering_pay_to_plant: entity.offering_pay_to_plant,
          // tree_validation_contract_id: entity.tree_validation_contract_id,
          // organization_id: id,
          // owner_id,
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
  async (
    { filter: { where, order, limit, offset }, ...idFilters } = undefined,
    url,
  ) => {
    const filter = FilterCriteria({ ...idFilters, ...where });
    const options = QueryOptions({ limit, offset, ...order });
    const { next, prev } = makeNextPrevUrls(url, filter, options);

    let dbStakeholders;
    let count;

    if (Object.keys(filter).length > 0) {
      const { stakeholders, count: dbCount } = await repo.getFilter(
        filter,
        options,
      );

      dbStakeholders = stakeholders;
      count = dbCount;
    } else {
      const { stakeholders, count: dbCount } = await repo.getAllStakeholders(
        options,
      );
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
      links: {
        prev,
        next,
      },
    };
  };

const getAllStakeholdersById =
  (repo, org_id) =>
  async ({ filter: { where, order }, ...idFilters } = undefined, url) => {
    const filter = FilterCriteria({ ...idFilters, ...where });
    const options = QueryOptions({ limit: 100, offset: 0, ...order });
    const { next, prev } = makeNextPrevUrls(
      `${url}/${org_id}`,
      filter,
      options,
    );
    const id = await getUUID(repo, org_id);

    let dbStakeholders;
    let count = 0;

    if (Object.keys(filter).length > 0) {
      const { stakeholders, count: dbCount } = await repo.getFilterById(
        id,
        filter,
        options,
      );
      dbStakeholders = stakeholders;
      count = dbCount;
    } else {
      const { stakeholders, count: dbCount } =
        await repo.getAllStakeholdersById(id, options);
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
      links: {
        prev,
        next,
      },
    };
  };

const getRelations = (repo, current_id) => async () => {
  // const id = await getUUID(repo, org_id);
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

  // get relations for owner
  // const relatedStakeholders = await repo.getRelatedIds(id);

  // check both stakeholders exist
  // const current = await repo.getById(id);
  // const delRelation = await repo.getById(stakeholder.data.id);

  // confirm there's permission to delete
  // note: owners should have their own id as owner_id
  // if (
  //   relatedStakeholders.includes(delRelation.id) &&
  //   (delRelation.owner_id === id ||
  //     current.owner_id === delRelation.owner_id ||
  //     id === null ||
  //     delRelation.owner_id === null ||
  //     current.owner_id === null)
  // ) {
  const { type, data } = stakeholder;
  const removeObj = {};

  if (type === 'parents' || type === 'children') {
    removeObj.parent_id = type === 'parents' ? data.id : id;
    removeObj.child_id = type === 'children' ? data.id : id;
  }

  const stakeholderRelation = await repo.deleteRelation(removeObj);

  return stakeholderRelation;
  // }
  // throw new Error(
  //   "Whoops! That stakeholder link can't be updated, no permission",
  // );
};

const updateStakeholder =
  (repo, org_id = null) =>
  async (data) => {
    // const id = await getUUID(repo, org_id);
    const editedStakeholder = StakeholderTree({ ...data });
    // const relatedStakeholders = await repo.getRelatedIds(id);
    // const foundStakeholder = await repo.getById(editedStakeholder.id);

    // confirm they have right to edit
    // if (
    //   (id && relatedStakeholders.includes(editedStakeholder.id)) ||
    //   foundStakeholder.owner_id === id ||
    //   id === null
    // ) {
    // remove children and parents temporarily to update
    const { children, parents, ...updateObj } = editedStakeholder;
    const stakeholder = await repo.updateStakeholder(updateObj);

    return StakeholderTree({ ...stakeholder, children, parents });
    // }
    // throw new Error({
    //   message: "Whoops! That stakeholder can't be edited, no permission",
    // });
  };

const createStakeholder =
  (repo, org_id = null) =>
  async (newStakeholder) => {
    const id = await getUUID(repo, org_id);
    const stakeholderObj = StakeholderPostObject({
      ...newStakeholder,
      // organization_id: orgId || id, // to prevent it from being 0
      // owner_id: id,
    });

    const stakeholder = await repo.createStakeholder(stakeholderObj, id);

    return StakeholderTree({ ...stakeholder });
  };

const deleteStakeholder =
  (repo, org_id = null) =>
  async (removeStakeholder) => {
    const id = await getUUID(repo, org_id);
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
