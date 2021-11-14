const Joi = require('joi');

const Session = require('../models/Session');
const StakeholderRepository = require('../repositories/StakeholderRepository');
const { getStakeholders } = require('../models/Stakeholder');

const stakeholderGetQuerySchema = Joi.object({
  stakeholder_id: Joi.number().integer(),
  stakeholder_uuid: Joi.string().uuid(),
  organization_id: Joi.number().integer(),
  limit: Joi.number().integer().greater(0).less(101),
  offset: Joi.number().integer().greater(-1),
}).unknown(false);

const stakeholderGet = async (req, res) => {
  await stakeholderGetQuerySchema.validateAsync(req.query, {
    abortEarly: false,
  });
  const session = new Session();
  const stakeholderRepo = new StakeholderRepository(session);

  const url = `${req.protocol}://${req.get('host')}/stakeholder`;

  const executeGetStakeholders = getStakeholders(stakeholderRepo);
  const result = await executeGetStakeholders(req.query, url);
  res.send(result);
  res.end();
};

module.exports = {
  stakeholderGet,
};
