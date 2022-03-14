UPDATE stakeholder.stakeholder
SET stakeholder.stakeholder.org_name = entity.name
FROM entity
WHERE entity.stakeholder_uuid = stakeholder.stakeholder.id;
