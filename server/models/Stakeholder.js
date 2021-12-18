/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { v4: uuidv4 } = require('uuid');
const { camelToSnakeCase } = require('../utils/utils');

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

const Stakeholder = ({
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
  });
};

const FilterCriteria = ({
  id = null,
  organization_id = null,
  type = null,
  orgName = null,
  firstName = null,
  lastName = null,
  imageUrl = null,
  email = null,
  phone = null,
  website = null,
  logoUrl = null,
  map = null,
}) => {
  return Object.entries({
    id,
    organization_id,
    type,
    orgName,
    firstName,
    lastName,
    imageUrl,
    email,
    phone,
    website,
    logoUrl,
    map,
  })
    .filter(
      (entry) => entry[1] !== undefined && entry[1] !== null && entry[1] !== '',
    )
    .reduce((result, item) => {
      result[camelToSnakeCase(item[0])] = item[1];
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

function makeNextPrevUrls(url, filter, options) {
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
}

async function getUUID(
  stakeholderRepo,
  id,
  options = { limit: 100, offset: 0 },
) {
  // get organization from old entity table
  // const org = await stakeholderRepo.getStakeholderByOrganizationId(id, options);

  // console.log('get by organization id ------> ', org.stakeholders[0]);

  // const entity = org.stakeholders[0];

  // return entity.stakeholder_uuid;

  return id && Number.isInteger(id)
    ? stakeholderRepo.getUUIDbyId(id).then((res) => res.id)
    : id;
}

const getAllStakeholders =
  (stakeholderRepo) =>
  async ({ filter: { where, order }, ...idFilters } = undefined, url) => {
    let filter = {};
    filter = FilterCriteria({ ...idFilters, ...where });
    // use default limit and offset values until there is more info on whether used & how updated
    let options = { limit: 100, offset: 0 };
    options = {
      ...options,
      ...QueryOptions({ ...order }),
    };

    // create next and prev urls
    const { next, prev } = makeNextPrevUrls(url, filter, options);

    // query the database
    let stakeholders;
    let count;

    if (Object.keys(filter).length > 0) {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getFilter(filter, options);
      stakeholders = dbStakeholders;
      count = dbCount;
    } else {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getAllStakeholderTrees(null, options);
      stakeholders = dbStakeholders;
      count = dbCount;
    }

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

const getStakeholders =
  (stakeholderRepo, acctStakeholder_id) =>
  async ({ filter: { where, order }, ...idFilters } = undefined, url) => {
    let filter = {};
    filter = FilterCriteria({ ...idFilters, ...where });
    // use default limit and offset values until there is more info on whether used & how updated
    let options = { limit: 100, offset: 0 };
    options = {
      ...options,
      ...QueryOptions({ ...order }),
    };

    // create next and prev urls
    const { next, prev } = makeNextPrevUrls(
      `${url}/${acctStakeholder_id}`,
      filter,
      options,
    );

    const orgId = Number(acctStakeholder_id);
    // get organization from old entity table
    const id = Number.isNaN(orgId)
      ? acctStakeholder_id
      : await getUUID(stakeholderRepo, orgId);

    console.log('getStakeholders', orgId, id);

    let stakeholders = [];
    let count = 0;

    if (Object.keys(filter).length > 0) {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getFilterById(id, filter, options);
      stakeholders = dbStakeholders;
      count = dbCount;
    } else {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getAllStakeholderTrees(id, options);
      stakeholders = dbStakeholders;
      count = dbCount;
    }

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return StakeholderTree({ ...row });
        }),
      // entities: org,
      totalCount: count,
      links: {
        prev,
        next,
      },
    };
  };

const getUnlinkedStakeholders =
  (stakeholderRepo, acctStakeholder_id) => async () => {
    const orgId = Number(acctStakeholder_id);
    // get organization from old entity table
    const id = Number.isNaN(orgId)
      ? acctStakeholder_id
      : await getUUID(stakeholderRepo, orgId);

    console.log('getUnlinkedStakeholders', orgId, id);

    const { stakeholders, count } = await stakeholderRepo.getUnlinked(id);

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return Stakeholder({ ...row });
        }),
      totalCount: count,
    };
  };

const updateLinkStakeholder =
  (stakeholderRepo, acctStakeholder_id = null) =>
  async (object) => {
    const orgId = Number(acctStakeholder_id);
    // get organization from old entity table
    const id = Number.isNaN(orgId)
      ? acctStakeholder_id
      : await getUUID(stakeholderRepo, orgId);

    console.log('updateLinkStakeholders', orgId, id);

    const foundStakeholder = await stakeholderRepo.getStakeholderById(
      object.data.id,
    );

    // confirm stakeholder exists before updating
    if (foundStakeholder.stakeholder.email) {
      const stakeholderRelation = await stakeholderRepo.updateLink(id, object);

      return stakeholderRelation;
    }

    return { error: { message: "Whoops! That stakeholder doesn't exist" } };
  };

const updateStakeholder =
  (stakeholderRepo, acctStakeholder_id = null) =>
  async (requestBody) => {
    const orgId = Number(acctStakeholder_id);
    // get organization from old entity table
    const id = Number.isNaN(orgId)
      ? acctStakeholder_id
      : await getUUID(stakeholderRepo, orgId);

    const object = StakeholderTree({ ...requestBody });

    console.log('updateStakeholder', orgId, id);

    const relatedStakeholders = await stakeholderRepo.getRelatedIds(id);

    const foundStakeholder = await stakeholderRepo.getStakeholderById(
      object.id,
    );

    // confirm stakeholder is related (can be edited) if there's an orgId OR just that it exists (if no orgId) before updating
    if (
      (orgId && relatedStakeholders.includes(object.id)) ||
      foundStakeholder.stakeholder.email
    ) {
      // remove children and parents temporarily
      const { children, parents, ...updateObj } = object;
      const stakeholder = await stakeholderRepo.updateStakeholder(
        acctStakeholder_id,
        updateObj,
      );

      return StakeholderTree({ ...stakeholder, children, parents });
    }

    return { error: { message: "Whoops! That stakeholder doesn't exist" } };
  };

const createStakeholder =
  (stakeholderRepo, acctStakeholder_id = null) =>
  async (requestBody) => {
    const orgId = Number(acctStakeholder_id);
    // get organization from old entity table
    const id = Number.isNaN(orgId)
      ? acctStakeholder_id
      : await getUUID(stakeholderRepo, orgId);

    const stakeholderObj = StakeholderPostObject({
      ...requestBody,
      organization_id: orgId,
      owner_id: id,
    });

    const stakeholder = await stakeholderRepo.createStakeholder(stakeholderObj);

    return { stakeholder: StakeholderTree({ ...stakeholder }) };
  };

module.exports = {
  getStakeholders,
  getAllStakeholders,
  getUnlinkedStakeholders,
  updateLinkStakeholder,
  StakeholderTree,
  Stakeholder,
  FilterCriteria,
  createStakeholder,
  updateStakeholder,
};
