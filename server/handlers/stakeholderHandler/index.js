const StakeholderService = require('../../services/StakeholderService');
const {
  getFilterAndLimitOptions,
  generatePrevAndNext,
} = require('../../utils/helper');
const {
  stakeholderGetQuerySchema,
  updateStakeholderSchema,
  stakeholderDeleteSchema,
  stakeholderPostSchema,
} = require('./schemas');

const stakeholderGetAll = async (req, res) => {
  await stakeholderGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const stakeholderService = new StakeholderService();

  const { stakeholders, totalCount } =
    await stakeholderService.getAllStakeholders(filter, limitOptions);

  const url = 'stakeholders';

  const links = generatePrevAndNext({
    url,
    count: totalCount,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    stakeholders,
    links,
    totalCount,
    query: { ...limitOptions, ...filter },
  });
};

const stakeholderGetAllById = async (req, res) => {
  await stakeholderGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const { id } = req.params;

  const { filter, limitOptions } = getFilterAndLimitOptions(req.query);
  const stakeholderService = new StakeholderService();

  const { stakeholders, totalCount } =
    await stakeholderService.getAllStakeholdersById(id, filter, limitOptions);

  const url = `stakeholders/${id}`;

  const links = generatePrevAndNext({
    url,
    count: totalCount,
    limitOptions,
    queryObject: { ...filter, ...limitOptions },
  });

  res.send({
    stakeholders,
    links,
    totalCount,
    query: { ...limitOptions, ...filter },
  });
};

const stakeholderCreate = async function (req, res) {
  const requestObject = await stakeholderPostSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const { id } = req.params;

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.createStakeholder(id, requestObject);

  res.status(201).json(result);
};

const stakeholderDelete = async function (req, res) {
  const requestObject = await stakeholderDeleteSchema.validateAsync(req.body, {
    abortEarly: false,
  });
  const { id } = req.params;

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.deleteStakeholder(id, requestObject);

  res.status(200).json(result);
};

const stakeholderUpdate = async function (req, res) {
  const requestObject = await updateStakeholderSchema.validateAsync(req.body, {
    abortEarly: false,
  });

  const stakeholderService = new StakeholderService();
  const result = await stakeholderService.updateStakeholder(requestObject);

  res.status(200).json(result);
};

// const stakeholderDeleteRelation = async function (req, res) {
//   const requestObject = await stakeholderDeleteSchema.validateAsync(req.body, {
//     abortEarly: false,
//   });
//   const { id } = req.params;

//   const stakeholderService = new StakeholderService();
//   const result = await stakeholderService.deleteRelation(id, requestObject);

//   res.status(200).json(result);
// };

module.exports = {
  stakeholderGetAllById,
  stakeholderGetAll,
  // stakeholderGetRelations,
  // stakeholderCreateRelation,
  // stakeholderDeleteRelation,
  stakeholderCreate,
  stakeholderDelete,
  stakeholderUpdate,
};
