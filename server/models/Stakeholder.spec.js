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
      'pwd_reset_required',
      'website',
      'wallet',
      'password',
      'salt',
      'active_contract_id',
      'offering_pay_to_plant',
      'tree_validation_contract_id',
      'logo_url',
      'map',
      'owner_id',
      'organization_id',
      'parents',
      'children'
    ]);
  });

  describe('FilterCriteria', () => {
    it('filterCriteria should not return results other than id, owner_id, organization_id, type, orgName, firstName, lastName, imageUrl, email, phone, website, logoUrl, map', () => {
      const filter = FilterCriteria({ check: true });
      expect(filter).to.be.empty;
    });

    it.skip('filterCriteria should not return undefined fields', () => {
      const filter = FilterCriteria({
        id: undefined,
        owner_id: undefined,
        organization_id: undefined,
      });
      expect(filter).to.be.empty;
    });

    it.skip('filterCriteria should return id, owner_id', () => {
      const filter = FilterCriteria({
        id: 'undefined',
        owner_id: 'undefined',
        organization_id: undefined,
      });
      expect(filter).to.have.keys(['id', 'owner_id']);
    });
  });

  describe('getAllStakeholders', () => {
    it('should get stakeholders with filter --id', async () => {
      const getFilter = sinon.mock();
      const getParents = sinon.mock();
      const getChildren = sinon.mock();
      const getStakeholderByOrganizationId = sinon.mock();
      const executeGetStakeholders = getAllStakeholders({
        getFilter,
        getParents,
        getChildren,
      });
      getFilter.resolves({ count: 1, stakeholders: [{ id: 1 }] });
      getParents.resolves([]);
      getChildren.resolves([]);
      const result = await executeGetStakeholders(
        {
          filter: {
            where: { id: 1 },
          },
        },
        '/stakeholder',
      );
      expect(
        getFilter.calledWith(1, {
          filter: 100,
          offset: 0,
        }),
      );

      sinon.assert.notCalled(getStakeholderByOrganizationId);
      expect(result.stakeholders).to.have.length(1);
      expect(result.totalCount).to.eql(1);
      expect(result.stakeholders[0]).property('id').eq(1);
    });

    it('should get stakeholders with filter --organization_id', async () => {
      const getStakeholderByOrganizationId = sinon.mock();
      const getFilter = sinon.mock();
      const getParents = sinon.mock();
      const getChildren = sinon.mock();
      const executeGetStakeholders = getAllStakeholders({
        getFilter,
        getParents,
        getChildren,
        getStakeholderByOrganizationId,
      });

      getFilter.resolves({ count: 1, stakeholders: [{ id: 1 }] });
      getParents.resolves([]);
      getChildren.resolves([]);
      getStakeholderByOrganizationId.resolves({
        totalCount: 1,
        stakeholders: [{ id: 1 }],
        links: {},
      });

      const result = await executeGetStakeholders(
        {
          filter: {
            where: { organization_id: 1 },
          },
        },
        '/stakeholder',
      );

      expect(
        getStakeholderByOrganizationId.calledWith(1, {
          filter: 100,
          offset: 0,
        }),
      );
      expect(
        getFilter.calledWith(1, {
          filter: 100,
          offset: 0,
        }),
      );
      // sinon.assert.notCalled(getFilterById);
      expect(result.stakeholders).to.have.length(1);
      expect(result.totalCount).to.eql(1);
      expect(result.stakeholders[0]).property('id').eq(1);
    });
  });
});
