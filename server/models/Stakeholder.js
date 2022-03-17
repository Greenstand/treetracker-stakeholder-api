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
  pwd_reset_required,
  password,
  wallet,
  salt,
  active_contract_id,
  offering_pay_to_plant,
  tree_validation_contract_id,
  website,
  logo_url,
  map,
  organization_id,
  owner_id,
}) => {
  return Object.freeze({
    id: uuidv4(), // give it a uuid,
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    pwd_reset_required: pwd_reset_required || false,
    password,
    wallet,
    salt,
    active_contract_id: active_contract_id || null,
    offering_pay_to_plant,
    tree_validation_contract_id: tree_validation_contract_id || null,
    website,
    logo_url,
    map,
    organization_id,
    owner_id,
  });
};

const StakeholderTree = ({
  id,
  organization_id,
  owner_id,
  type,
  org_name,
  first_name,
  last_name,
  email,
  phone,
  pwd_reset_required,
  password,
  wallet,
  salt,
  active_contract_id,
  offering_pay_to_plant,
  tree_validation_contract_id,
  website,
  logo_url,
  map,
  children = [],
  parents = [],
}) => {
  return Object.freeze({
    id,
    organization_id,
    owner_id,
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    pwd_reset_required,
    password,
    wallet,
    salt,
    active_contract_id,
    offering_pay_to_plant,
    tree_validation_contract_id,
    website,
    logo_url,
    map,
    children,
    parents,
  });
};

// const Stakeholder = ({
//   id,
//   organization_id,
//   owner_id,
//   type,
//   org_name,
//   first_name,
//   last_name,
//   email,
//   phone,
//   pwd_reset_required,
//   password,
//   wallet,
//   salt,
//   active_contract_id,
//   offering_pay_to_plant,
//   tree_validation_contract_id,
//   website,
//   logo_url,
//   map,
// }) => {
//   return Object.freeze({
//     id,
//     organization_id,
//     owner_id,
//     type,
//     org_name,
//     first_name,
//     last_name,
//     email,
//     phone,
//     pwd_reset_required,
//     password,
//     wallet,
//     salt,
//     active_contract_id,
//     offering_pay_to_plant,
//     tree_validation_contract_id,
//     website,
//     logo_url,
//     map,
//   });
// };

const FilterCriteria = ({
  id = null,
  owner_id = null,
  organization_id = null,
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
}) => {
  return Object.entries({
    id,
    owner_id,
    organization_id,
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

const getUUID = async (repo, id, options = { limit: 100, offset: 0 }) => {
  // check for id in current table first
  const stakeholderFound = await repo.getUUIDbyId(id);

  if (!stakeholderFound) {
    // get organization from old entity table
    const { stakeholders } = await repo.getStakeholderByOrganizationId(
      id,
      options,
    );

    const owner_id = stakeholders[0].stakeholder_uuid;

    stakeholders.forEach(async (entity, i) => {
      // console.log('entity to create', entity);
      // map from entity fields to stakeholder fields
      const stakeholderObj = {
        id: entity.stakeholder_uuid,
        organization_id: id,
        owner_id,
        type: entity.type,
        org_name: entity.name,
        first_name: entity.first_name,
        last_name: entity.last_name,
        email: entity.email,
        phone: entity.phone,
        pwd_reset_required: entity.pwd_reset_required,
        password: entity.password,
        wallet: entity.wallet,
        salt: entity.salt,
        active_contract_id: entity.active_contract_id,
        offering_pay_to_plant: entity.offering_pay_to_plant,
        tree_validation_contract_id: entity.tree_validation_contract_id,
        website: entity.website,
        logo_url: entity.logo_url,
        map: entity.map,
      };

      const stakeholder = await repo.createStakeholder(stakeholderObj);

      if (i > 0) {
        // if there are relations, create links
        await repo.createRelation(owner_id, {
          type: 'children',
          data: stakeholder,
        });
      }
    });

    return stakeholders[0].stakeholder_uuid;
  }

  return stakeholderFound.id;
};

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
    let filter = {};
    filter = FilterCriteria({ ...idFilters, ...where });

    const options = {
      ...QueryOptions({ limit, offset, ...order }),
    };

    // get organization from old entity table, enter org id to insert it and it's children
    // await getUUID(repo, 1);

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
      count,
    };
  };

const getAllStakeholdersById =
  (repo, acctStakeholder_id) =>
  async ({ filter: { where, order }, ...idFilters } = undefined, url) => {
    let filter = {};
    filter = FilterCriteria({ ...idFilters, ...where });

    const options = {
      ...QueryOptions({ limit: 100, offset: 0, ...order }),
    };

    const orgId = Number(acctStakeholder_id);
    // get organization from old entity table
    const id =
      acctStakeholder_id === null || Number.isNaN(orgId)
        ? acctStakeholder_id
        : await getUUID(repo, orgId);

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
      count,
    };
  };

const getRelations = (repo, current_id) => async (org_id) => {
  const orgId = Number(org_id);
  // get organization from old entity table
  const owner_id =
    org_id === null || Number.isNaN(orgId)
      ? org_id
      : await getUUID(repo, orgId);

  const { stakeholders, count } = await repo.getRelations(current_id, owner_id);

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

const getNonRelations = (repo, current_id) => async (org_id) => {
  const orgId = Number(org_id);
  // get organization from old entity table
  const owner_id =
    org_id === null || Number.isNaN(orgId)
      ? org_id
      : await getUUID(repo, orgId);

  const { stakeholders, count } = await repo.getNonRelations(
    current_id,
    owner_id,
  );

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

const createRelation = (repo, current_id) => async (stakeholder) => {
  const orgId = Number(current_id);
  // get organization from old entity table
  const id =
    current_id === null || Number.isNaN(orgId)
      ? current_id
      : await getUUID(repo, orgId);

  // check both stakeholders exist
  const current = await repo.verifyById(id);
  const newRelation = await repo.verifyById(stakeholder.data.id);

  // confirm there's permission to create
  // note: owners should have their own id as owner_id
  if (
    newRelation.owner_id === id ||
    current.owner_id === newRelation.owner_id ||
    id === null ||
    newRelation.owner_id === null
  ) {
    const { type, data } = stakeholder;
    const insertObj = {};

    if (type === 'parents' || type === 'children') {
      insertObj.parent_id = type === 'parents' ? data.id : id;
      insertObj.child_id = type === 'children' ? data.id : id;
    }
    // need to update db relation table before implementing
    // insertObj.grower_id = type === 'growers' ? id : null;
    // insertObj.user_id = type === 'users' ? id : null;

    const stakeholderRelation = await repo.createRelation(insertObj);

    return stakeholderRelation;
  }
  throw new Error({
    message: "Whoops! That stakeholder link can't be updated, no permission",
  });
};

const deleteRelation = (repo, current_id) => async (stakeholder) => {
  const orgId = Number(current_id);
  // get organization from old entity table
  const id =
    current_id === null || Number.isNaN(orgId)
      ? current_id
      : await getUUID(repo, orgId);

  // get relations for owner
  const relatedStakeholders = await repo.getRelatedIds(id);

  // check both stakeholders exist
  const current = await repo.verifyById(id);
  const delRelation = await repo.verifyById(stakeholder.data.id);

  // confirm there's permission to delete
  // note: owners should have their own id as owner_id
  if (
    relatedStakeholders.includes(delRelation.id) &&
    (delRelation.owner_id === id ||
      current.owner_id === delRelation.owner_id ||
      id === null ||
      delRelation.owner_id === null ||
      current.owner_id === null)
  ) {
    const { type, data } = stakeholder;
    const removeObj = {};

    if (type === 'parents' || type === 'children') {
      removeObj.parent_id = type === 'parents' ? data.id : id;
      removeObj.child_id = type === 'children' ? data.id : id;
    }

    const stakeholderRelation = await repo.deleteRelation(removeObj);

    return stakeholderRelation;
  }
  throw new Error(
    "Whoops! That stakeholder link can't be updated, no permission",
  );
};

const updateStakeholder =
  (repo, owner_id = null) =>
  async (data) => {
    const orgId = Number(owner_id);
    // get organization from old entity table
    const id =
      owner_id === null || Number.isNaN(orgId)
        ? owner_id
        : await getUUID(repo, orgId);

    const editedStakeholder = StakeholderTree({ ...data });
    const relatedStakeholders = await repo.getRelatedIds(id);
    const foundStakeholder = await repo.verifyById(editedStakeholder.id);

    // confirm they have right to edit
    if (
      (id && relatedStakeholders.includes(editedStakeholder.id)) ||
      foundStakeholder.owner_id === id ||
      id === null
    ) {
      // remove children and parents temporarily to update
      const { children, parents, ...updateObj } = editedStakeholder;
      const stakeholder = await repo.updateStakeholder(updateObj);

      return StakeholderTree({ ...stakeholder, children, parents });
    }
    throw new Error({
      message: "Whoops! That stakeholder can't be edited, no permission",
    });
  };

const createStakeholder =
  (repo, owner_id = null) =>
  async (newStakeholder) => {
    const orgId = Number(owner_id);
    // get organization from old entity table
    const id =
      owner_id === null || Number.isNaN(orgId)
        ? owner_id
        : await getUUID(repo, orgId);

    const stakeholderObj = StakeholderPostObject({
      ...newStakeholder,
      organization_id: orgId || id, // to prevent it from being 0
      owner_id: id,
    });

    const stakeholder = await repo.createStakeholder(stakeholderObj);

    return StakeholderTree({ ...stakeholder });
  };

module.exports = {
  getAllStakeholdersById,
  getAllStakeholders,
  createStakeholder,
  updateStakeholder,
  getRelations,
  getNonRelations,
  createRelation,
  deleteRelation,
  StakeholderTree,
  FilterCriteria,
};
