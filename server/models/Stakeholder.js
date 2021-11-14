const Stakeholder = ({
  id,
  type,
  name,
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
  map_name,
  stakeholder_uuid,
}) => {
  return Object.freeze({
    id,
    type,
    name,
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
    map_name,
    stakeholder_uuid,
  });
};

const FilterCriteria = ({
  stakeholder_id = undefined,
  stakeholder_uuid = undefined,
  organization_id = undefined,
}) => {
  return Object.entries({
    id: stakeholder_id,
    stakeholder_uuid,
    organization_id,
  })
    .filter((entry) => entry[1] !== undefined)
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

const getStakeholders =
  (stakeholderRepo) =>
  async (filterCriteria = undefined, url) => {
    let filter = {};
    filter = FilterCriteria({
      ...filterCriteria,
    });

    let options = { limit: 100, offset: 0 };

    options = { ...options, ...QueryOptions({ ...filterCriteria }) };

    const queryFilterObjects = { ...filterCriteria };
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

    let stakeholders = [];
    let count = 0;

    if (filter.organization_id) {
      const { stakeholders: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getStakeholderByOrganizationId(
          filter.organization_id,
          options,
        );
      stakeholders = dbStakeholders;
      count = dbCount;
    } else {
      const { result: dbStakeholders, count: dbCount } =
        await stakeholderRepo.getByFilter(filter, options);
      stakeholders = dbStakeholders;
      count = dbCount;
    }

    return {
      stakeholders: stakeholders.map((row) => {
        return Stakeholder({ ...row });
      }),
      totalCount: count,
      links: {
        prev,
        next,
      },
    };
  };

module.exports = {
  getStakeholders,
  Stakeholder,
  FilterCriteria,
};
