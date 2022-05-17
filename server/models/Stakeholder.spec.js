require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
const { expect } = require('chai');
const sinon = require('sinon');
const StakeholderRepository = require('../repositories/StakeholderRepository');
const Stakeholder = require('./Stakeholder');

describe('Stakeholder Model', () => {
  it('Stakeholder Model should return defined fields', () => {
    const stakeholder = Stakeholder.StakeholderTree({});
    expect(stakeholder).to.have.keys([
      'id',
      'type',
      'org_name',
      'first_name',
      'last_name',
      'email',
      'phone',
      'website',
      'logo_url',
      'map',
      'parents',
      'children',
    ]);
  });

  describe('getAllStakeholders', () => {
    let getFilterStub;
    let getParentsStub;
    let getChildrenStub;
    before(() => {
      getFilterStub = sinon
        .stub(StakeholderRepository.prototype, 'getFilter')
        .callsFake(async (filter) => {
          return {
            count: 1,
            stakeholders: [{ id: filter.id }],
          };
        });
      getParentsStub = sinon
        .stub(StakeholderRepository.prototype, 'getParents')
        .resolves([]);
      getChildrenStub = sinon
        .stub(StakeholderRepository.prototype, 'getChildren')
        .resolves([]);
    });

    after(() => {
      getFilterStub.restore();
      getParentsStub.restore();
      getChildrenStub.restore();
    });

    it('should get stakeholders with filter -- id (uuid)', async () => {
      const stakeholder = new Stakeholder();
      const result = await stakeholder.getAllStakeholders({
        id: '792a4eee-8e18-4750-a56f-91bdec383aa6',
      });

      expect(result.stakeholders).to.have.length(1);
      expect(result.totalCount).to.eql(1);
      expect(result.stakeholders[0])
        .property('id')
        .eq('792a4eee-8e18-4750-a56f-91bdec383aa6');
    });
  });
});
