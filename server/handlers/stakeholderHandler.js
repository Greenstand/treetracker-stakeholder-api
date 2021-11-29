const Joi = require('joi');
const log = require('loglevel');

const {
  createStakeholder,
  getStakeholders,
  getAllStakeholders,
  updateStakeholder,
} = require('../models/Stakeholder');
// const { dispatch } = require('../models/DomainEvent');

const Session = require('../models/Session');
// const { publishMessage } = require('../infra/messaging/RabbitMQMessaging');

const StakeholderRepository = require('../repositories/StakeholderRepository');

const stakeholderGetQuerySchema = Joi.object({
  id: Joi.number().integer(),
  stakeholder_uuid: Joi.string().uuid(),
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

const stakeholderGetAll = async (req, res) => {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const query = { ...req.query, filter };
  await stakeholderGetQuerySchema.validateAsync(query, {
    abortEarly: false,
  });
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  const url = `${req.protocol}://${req.get('host')}/stakeholder`;

  const executeGetAllStakeholders = getAllStakeholders(stakeholderRepo);
  const result = await executeGetAllStakeholders(query, url);
  res.send(result);
  res.end();
};

const stakeholderGet = async function (req, res) {
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  // console.log('filter', filter);
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
  const result = await executeGetStakeholder(query, url);
  res.send(result);
  res.end();
};

const stakeholderPost = async function (req, res) {
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);
  // const eventRepository = new EventRepository(session);
  const executeCreateStakeholder = createStakeholder(
    stakeholderRepo,
    id,
    // eventRepository,
  );

  // const eventDispatch = dispatch(eventRepository, publishMessage);

  try {
    console.log('STAKEHOLDER ROUTER post', req.body);
    const stakeholderObj = stakeholderFromRequest({ ...req.body });
    await session.beginTransaction();
    const { newStakeholder /*raisedEvents*/ } = await executeCreateStakeholder(
      stakeholderObj,
    );

    console.log('STAKEHOLDER ROUTER newStakeholder', newStakeholder);

    await session.commitTransaction();
    // raisedEvents.forEach((domainEvent) =>
    //   eventDispatch('stakeholder-created', domainEvent),
    // );
    res.status(201).json({
      ...newStakeholder,
    });
  } catch (e) {
    log.error(e);
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    let result = e;
    res.status(422).json({ ...result });
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

  // remove fields that aren't required to have a value
  const updateStakeholderSchema = Joi.object({
    id: Joi.number().required(),
    stakeholder_uuid: Joi.string().required(),
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
    if (session.isTransactionInProgress()) {
      await session.rollbackTransaction();
    }
    next(e);
  }
};

module.exports = {
  stakeholderGet,
  stakeholderGetAll,
  stakeholderPost,
  stakeholderPatch,
};
