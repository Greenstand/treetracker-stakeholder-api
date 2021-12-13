const { expect } = require('chai');
const mockKnex = require('mock-knex');
const StakeholderRepository = require('./StakeholderRepository');
const knex = require('../../database/connection');

const tracker = mockKnex.getTracker();
const Session = require('../models/Session');

describe('StakeholderRepository', () => {
  let stakeholderRepository;

  beforeEach(() => {
    mockKnex.mock(knex);
    tracker.install();
    const session = new Session();
    stakeholderRepository = new StakeholderRepository(session);
  });

  afterEach(() => {
    tracker.uninstall();
    mockKnex.unmock(knex);
  });

  it('getStakeholderById', async () => {
    tracker.uninstall();
    tracker.install();
    tracker.on('query', (query) => {
      let bool = query.sql.match(/select.*.*id.*.*stakeholder_uuid.*/);
      if (!bool)
        bool = query.sql.match(
          /select.*stakeholder.*id.*or.*stakeholder_uuid.*limit.*offset/,
        );
      expect(bool);
      const stakeholder = { id: 1 };
      query.response(stakeholder);
    });
    const { stakeholder } = await stakeholderRepository.getStakeholderById(1);
    expect(stakeholder).property('id').eq(1);
  });

  it.skip('getStakeholderByOrganizationId', async () => {
    tracker.uninstall();
    tracker.install();
    tracker.on('query', (query) => {
      let bool = query.sql.match(
        /select.*count.*.*entity_id.*.*getEntityRelationshipChildren.*/,
      );
      if (!bool)
        bool = query.sql.match(
          /select.*entity.*entity_id.*getEntityRelationshipChildren.*limit.*offset/,
        );
      expect(bool);
      const response = query.sql.includes('count')
        ? { rows: [{ count: 1 }] }
        : { rows: { id: 1 } };
      query.response(response);
    });
    const { stakeholders, count } =
      await stakeholderRepository.getStakeholderByOrganizationId(1, {
        limit: 1,
        offset: 1,
      });
    expect(stakeholders).property('id').eq(1);
    expect(count).eq(1);
  });
});
