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
      'name',
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
      'map_name',
      'stakeholder_uuid',
    ]);
  });

  describe('FilterCriteria', () => {
    it('filterCriteria should not return results other than stakeholder_id, stakeholder_uuid, organization_id', () => {
      const filter = FilterCriteria({ check: true });
      expect(filter).to.be.empty;
    });

    it('filterCriteria should not return undefined fields', () => {
      const filter = FilterCriteria({
        stakeholder_id: undefined,
        stakeholder_uuid: undefined,
        organization_id: undefined,
      });
      expect(filter).to.be.empty;
    });

    it('filterCriteria should return id, stakeholder_uuid, organization_id', () => {
      const filter = FilterCriteria({
        stakeholder_id: 'undefined',
        stakeholder_uuid: 'undefined',
        organization_id: undefined,
      });
      expect(filter).to.have.keys(['id', 'stakeholder_uuid']);
    });
  });

  describe('getStakeholders', () => {
    it('should get stakeholders with filter --stakeholder_id', async () => {
      const getByFilter = sinon.mock();
      const getStakeholderByOrganizationId = sinon.mock();
      const executeGetStakeholders = getStakeholders({
        getByFilter,
        getStakeholderByOrganizationId,
      });
      getByFilter.resolves({ count: 1, result: [{ id: 1 }] });
      const result = await executeGetStakeholders({ stakeholder_id: 1 });
      expect(
        getByFilter.calledWith(1, {
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
      const getByFilter = sinon.mock();
      const executeGetStakeholders = getStakeholders({
        getStakeholderByOrganizationId,
        getByFilter,
      });
      getStakeholderByOrganizationId.resolves({
        count: 1,
        stakeholders: [{ id: 1 }],
      });
      const result = await executeGetStakeholders({ organization_id: 1 });
      expect(
        getStakeholderByOrganizationId.calledWith(1, {
          filter: 100,
          offset: 0,
        }),
      );
      sinon.assert.notCalled(getByFilter);
      expect(result.stakeholders).to.have.length(1);
      expect(result.totalCount).to.eql(1);
      expect(result.stakeholders[0]).property('id').eq(1);
    });
  });
});
