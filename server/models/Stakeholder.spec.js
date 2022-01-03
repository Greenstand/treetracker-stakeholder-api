const { expect } = require('chai');
const sinon = require('sinon');
const {
  getStakeholders,
  Stakeholder,
  FilterCriteria,
} = require('./Stakeholder');

describe('Stakeholder Model', () => {
  it('Stakeholder Model should return defined fields', () => {
    const stakeholder = Stakeholder({});
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
    ]);
  });

  describe('FilterCriteria', () => {
    it('filterCriteria should not return results other than id, owner_id, organization_id, type, orgName, firstName, lastName, imageUrl, email, phone, website, logoUrl, map', () => {
      const filter = FilterCriteria({ check: true });
      expect(filter).to.be.empty;
    });

    it('filterCriteria should not return undefined fields', () => {
      const filter = FilterCriteria({
        id: undefined,
        owner_id: undefined,
        organization_id: undefined,
      });
      expect(filter).to.be.empty;
    });

    it('filterCriteria should return id, owner_id', () => {
      const filter = FilterCriteria({
        id: 'undefined',
        owner_id: 'undefined',
        organization_id: undefined,
      });
      expect(filter).to.have.keys(['id', 'owner_id']);
    });
  });

  describe('getStakeholders', () => {
    it('should get stakeholders with filter --id', async () => {
      const getFilterById = sinon.mock();
      const getStakeholderByOrganizationId = sinon.mock();
      const executeGetStakeholders = getStakeholders({
        getFilterById,
        getStakeholderByOrganizationId,
      });
      getFilterById.resolves({ count: 1, stakeholders: [{ id: 1 }] });
      const result = await executeGetStakeholders({
        filter: {
          where: { id: 1 },
        },
      });
      expect(
        getFilterById.calledWith(1, {
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
      const getFilterById = sinon.mock();
      const executeGetStakeholders = getStakeholders({
        getStakeholderByOrganizationId,
        getFilterById,
      });

      getStakeholderByOrganizationId.resolves({
        totalCount: 1,
        stakeholders: [{ id: 1 }],
        links: {},
      });

      getFilterById.resolves({ count: 1, stakeholders: [{ id: 1 }] });

      const result = await executeGetStakeholders({
        filter: {
          where: { organization_id: 1 },
        },
      });

      expect(
        getStakeholderByOrganizationId.calledWith(1, {
          filter: 100,
          offset: 0,
        }),
      );
      expect(
        getFilterById.calledWith(1, {
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
