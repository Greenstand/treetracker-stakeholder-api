/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
const { v4: uuidv4 } = require('uuid');
const { camelToSnakeCase } = require('../utils/utils');

const StakeholderRequestObject = ({
  id,
  stakeholder_uuid,
  type,
  org_name,
  first_name,
  last_name,
  email,
  phone,
  pwd_reset_required,
  website,
  wallet,
  password,
  salt,
  active_contract_id,
  offering_pay_to_plant,
  tree_validation_contract_id,
  logo_url,
  map,
  filter,
}) => {
  return Object.freeze({
    id: id || uuidv4,
    stakeholder_uuid,
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    pwd_reset_required,
    website,
    wallet,
    password,
    salt,
    active_contract_id,
    offering_pay_to_plant,
    tree_validation_contract_id,
    logo_url,
    map,
    filter,
  });
};

const Stakeholder = ({
  id,
  stakeholder_uuid,
  type,
  org_name,
  first_name,
  last_name,
  email,
  phone,
  pwd_reset_required,
  website,
  wallet,
  password,
  salt,
  active_contract_id,
  offering_pay_to_plant,
  tree_validation_contract_id,
  logo_url,
  map,
  children = [],
  parents = [],
}) => {
  return Object.freeze({
    id,
    stakeholder_uuid,
    type,
    org_name,
    first_name,
    last_name,
    email,
    phone,
    pwd_reset_required,
    website,
    wallet,
    password,
    salt,
    active_contract_id,
    offering_pay_to_plant,
    tree_validation_contract_id,
    logo_url,
    map,
    children,
    parents,
  });
};

const FilterCriteria = ({
  id = null,
  stakeholder_uuid = null,
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
    stakeholder_uuid,
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
        await stakeholderRepo.getAllStakeholderTrees(options);
      stakeholders = dbStakeholders;
      count = dbCount;
    }

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return Stakeholder({ ...row });
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
    console.log('------> WHERE, FILTER ------> ', where, filter);
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

    let stakeholders = [];
    let count = 0;

    if (Object.keys(filter).length > 0) {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getFilterById(
          acctStakeholder_id,
          filter,
          options,
        );
      stakeholders = dbStakeholders;
      count = dbCount;
    } else {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getStakeholderTreeById(
          acctStakeholder_id,
          options,
        );
      stakeholders = dbStakeholders;
      count = dbCount;
    }

    return {
      stakeholders:
        stakeholders &&
        stakeholders.map((row) => {
          return Stakeholder({ ...row });
        }),
      totalCount: count,
      links: {
        prev,
        next,
      },
    };
  };

const updateStakeholder =
  (stakeholderRepo, acctStakeholder_id = null) =>
  async (object) => {
    // const relatedStakeholders = await stakeholderRepo.getRelatedIds(
    //   acctStakeholder_id,
    // );

    const foundStakeholder = await stakeholderRepo.getStakeholderById(
      object.id,
    );

    // confirm stakeholder is related (if id provided is allowed to edit) OR just that it exists (if no id provided) before updating
    if (
      // (acctStakeholder_id && relatedStakeholders.includes(object.id)) ||
      foundStakeholder.stakeholder.email
    ) {
      // remove children and parents
      const { children, parents, ...updateObj } = object;
      const stakeholder = await stakeholderRepo.updateStakeholder(
        acctStakeholder_id,
        updateObj,
      );

      console.log('updated stakeholder -------> ', stakeholder);

      return Stakeholder({ ...stakeholder, children, parents });
    }

    return { error: { message: "Whoops! That stakeholder doesn't exist" } };
  };

const createStakeholder =
  async (stakeholderRepo, acctStakeholder_id) => async (requestBody) => {
    const { relation = null, ...obj } = requestBody;
    const stakeholderObj = StakeholderRequestObject({ ...obj });

    console.log('STAKEHOLDER MODEL requestBody', requestBody, stakeholderObj);

    const stakeholder = await stakeholderRepo.createStakeholder(stakeholderObj);

    const linked = await stakeholderRepo.linkStakeholder(
      acctStakeholder_id,
      relation,
      stakeholder.id,
    );

    console.log('linked', linked);

    return { stakeholder: Stakeholder({ ...stakeholder }) };
  };

module.exports = {
  getStakeholders,
  getAllStakeholders,
  Stakeholder,
  FilterCriteria,
  createStakeholder,
  updateStakeholder,
};
