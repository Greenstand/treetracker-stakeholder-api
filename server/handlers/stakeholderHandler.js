const Joi = require('joi');
const log = require('loglevel');

const {
  getStakeholders,
  getAllStakeholders,
  getUnlinkedStakeholders,
  updateLinkStakeholder,
  updateStakeholder,
  createStakeholder,
} = require('../models/Stakeholder');
// const { dispatch } = require('../models/DomainEvent');

const Session = require('../models/Session');
// const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const StakeholderRepository = require('../repositories/StakeholderRepository');

const stakeholderGetQuerySchema = Joi.object({
  id: Joi.string().uuid(),
  organization_id: Joi.number().integer(),
  owner_id: Joi.string().uuid(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
  type: Joi.string(),
  logo_url: Joi.string(),
  org_name: Joi.string(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  map: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  website: Joi.string(),
  children: Joi.array(),
  parents: Joi.array(),
  users: Joi.array(),
  filter: Joi.object(),
}).unknown(false);

const stakeholderGetAll = async (req, res, next) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const query = { ...req.query, filter };
  await stakeholderGetQuerySchema.validateAsync(query, {
    abortEarly: false,
  });
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  const url = `${req.protocol}://${req.get('host')}/stakeholder`;

  const executeGetAllStakeholders = getAllStakeholders(stakeholderRepo);
  try {
    const result = await executeGetAllStakeholders(query, url);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderGet = async function (req, res, next) {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const query = { ...req.query, filter };
  await stakeholderGetQuerySchema.validateAsync(query, {
    abortEarly: false,
  });
  const { stakeholder_id } = req.params;
  const session = new Session(false);
  const stakeholderRepo = new StakeholderRepository(session);
  const url = `${req.protocol}://${req.get('host')}/stakeholder`;
  const executeGetStakeholder = getStakeholders(
    stakeholderRepo,
    Number(stakeholder_id),
  );
  try {
    const result = await executeGetStakeholder(query, url);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderGetUnlinked = async function (req, res, next) {
  const { acctStakeholder_id = null, stakeholder_id = null } = req.params;
  const session = new Session(false);
  const stakeholderRepo = new StakeholderRepository(session);
  const executeGetUnlinked = getUnlinkedStakeholders(
    stakeholderRepo,
    acctStakeholder_id,
  );
  try {
    const result = await executeGetUnlinked(stakeholder_id);
    res.send(result);
    res.end();
  } catch (e) {
    next(e);
  }
};

const stakeholderUpdateLink = async function (req, res, next) {
  const { stakeholder_id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  const executeUpdateLink = updateLinkStakeholder(
    stakeholderRepo,
    stakeholder_id,
  );

  // only fields that are required to have a value
  const updateStakeholderSchema = Joi.object({
    type: Joi.string().required(),
    linked: Joi.boolean().required(),
  });

  try {
    const value = await updateStakeholderSchema
      .unknown(true)
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const result = await executeUpdateLink(value);
    res.send(result);
    res.end();
  } catch (e) {
    // if (session.isTransactionInProgress()) {
    //   await session.rollbackTransaction();
    // }
    next(e);
  }
};

const stakeholderPost = async function (req, res, next) {
  const { stakeholder_id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  // const eventRepository = new EventRepository(session);
  const executeCreateStakeholder = createStakeholder(
    stakeholderRepo,
    stakeholder_id,
    // eventRepository,
  );

  // const eventDispatch = dispatch(eventRepository, publishMessage);

  // only fields that are required to have a value
  const stakeholderPostSchema = Joi.object({
    type: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).unknown();

  try {
    const value = await stakeholderPostSchema.validateAsync(req.body, {
      abortEarly: false,
    });

    // await session.beginTransaction();
    const result = await executeCreateStakeholder({
      ...value,
    });

    // await session.commitTransaction();
    // raisedEvents.forEach((domainEvent) =>
    //   eventDispatch('stakeholder-created', domainEvent),
    // );
    res.status(201).json(result);
  } catch (e) {
    log.error(e);
    // if (session.isTransactionInProgress()) {
    //   await session.rollbackTransaction();
    // }
    // res.status(422).json({ ...e });
    next(e);
  }
};

const stakeholderPatch = async function (req, res, next) {
  const { stakeholder_id } = req.params;
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  const executeUpdateStakeholder = updateStakeholder(
    stakeholderRepo,
    stakeholder_id,
  );

  // only fields that are required to have a value
  const updateStakeholderSchema = Joi.object({
    id: Joi.string().uuid().required(),
    type: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });

  try {
    const value = await updateStakeholderSchema
      .unknown(true)
      .validateAsync(req.body, {
        abortEarly: false,
      });

    const result = await executeUpdateStakeholder({
      ...value,
    });

    res.send(result);
    res.end();
  } catch (e) {
    // if (session.isTransactionInProgress()) {
    //   await session.rollbackTransaction();
    // }
    next(e);
  }
};

module.exports = {
  stakeholderGet,
  stakeholderGetAll,
  stakeholderGetUnlinked,
  stakeholderUpdateLink,
  stakeholderPost,
  stakeholderPatch,
};
