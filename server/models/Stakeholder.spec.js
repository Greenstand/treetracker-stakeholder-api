const { expect } = require('chai');
const sinon = require('sinon');
const {
  getAllStakeholders,
  StakeholderTree,
  FilterCriteria,
} = require('./Stakeholder');

describe('Stakeholder Model', () => {
  it('Stakeholder Model should return defined fields', () => {
    const stakeholder = StakeholderTree({});
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

  describe('FilterCriteria', () => {
    it('filterCriteria should not return results other than id, type, orgName, firstName, lastName, email, phone, website, logoUrl, map', () => {
      const filter = FilterCriteria({ check: true });
      // eslint-disable-next-line no-unused-expressions
      expect(filter).to.be.empty;
    });

    it('filterCriteria should not return undefined fields', () => {
      const filter = FilterCriteria({
        id: undefined,
      });
      // eslint-disable-next-line no-unused-expressions
      expect(filter).to.be.empty;
    });
  });

  describe('getAllStakeholders', () => {
    it('should get stakeholders with filter -- id (uuid)', async () => {
      const getFilter = sinon.mock();
      const getParents = sinon.mock();
      const getChildren = sinon.mock();
      const getStakeholderByOrganizationId = sinon.mock();
      const executeGetStakeholders = getAllStakeholders({
        getFilter,
        getParents,
        getChildren,
      });
      getFilter.resolves({
        count: 1,
        stakeholders: [{ id: '792a4eee-8e18-4750-a56f-91bdec383aa6' }],
      });
      getParents.resolves([]);
      getChildren.resolves([]);
      const result = await executeGetStakeholders(
        {
          filter: {
            where: { id: '792a4eee-8e18-4750-a56f-91bdec383aa6' },
          },
        },
        '/stakeholder',
      );

      expect(
        getFilter.calledWith(1, {
          filter: 100,
        }),
      );

      sinon.assert.notCalled(getStakeholderByOrganizationId);
      expect(result.stakeholders).to.have.length(1);
      expect(result.totalCount).to.eql(1);
      expect(result.stakeholders[0])
        .property('id')
        .eq('792a4eee-8e18-4750-a56f-91bdec383aa6');
    });

    it('should get stakeholders with filter -- id (integer)', async () => {
      const getFilter = sinon.mock();
      const getParents = sinon.mock();
      const getChildren = sinon.mock();
      const getStakeholderByOrganizationId = sinon.mock();
      const executeGetStakeholders = getAllStakeholders({
        getFilter,
        getParents,
        getChildren,
        getStakeholderByOrganizationId,
      });

      getFilter.resolves({
        count: 1,
        stakeholders: [{ id: 1 }],
      });
      getParents.resolves([]);
      getChildren.resolves([]);
      getStakeholderByOrganizationId.resolves({
        totalCount: 1,
        stakeholders: [{ id: 1 }],
      });

      const result = await executeGetStakeholders(
        {
          filter: {
            where: { id: 1 },
          },
        },
        '/stakeholder',
      );

      expect(
        getStakeholderByOrganizationId.calledWith(1, {
          filter: 100,
        }),
      );
      expect(
        getFilter.calledWith(1, {
          filter: 100,
        }),
      );
      // sinon.assert.notCalled(getFilterById);
      expect(result.stakeholders).to.have.length(1);
      expect(result.totalCount).to.eql(1);
      expect(result.stakeholders[0]).property('id').eq(1);
    });
  });
});
