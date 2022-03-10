CREATE FUNCTION getStakeholderChildren
(
  uuid
)
RETURNS TABLE (stakeholder_id uuid, parent_id uuid, depth int, relations_type text, relations_role text)
AS $$
WITH RECURSIVE children AS (
   SELECT stakeholder.stakeholder.id, stakeholder.stakeholder_relation.parent_id, 1 as depth, stakeholder.stakeholder_relation.type, stakeholder.stakeholder_relation.role
   FROM stakeholder.stakeholder
   LEFT JOIN stakeholder.stakeholder_relation ON stakeholder.stakeholder_relation.child_id = stakeholder.stakeholder.id 
   WHERE stakeholder.stakeholder.id = $1
  UNION
   SELECT next_child.id, stakeholder.stakeholder_relation.parent_id, depth + 1, stakeholder.stakeholder_relation.type, stakeholder.stakeholder_relation.role
   FROM stakeholder.stakeholder next_child
   JOIN stakeholder.stakeholder_relation ON stakeholder.stakeholder_relation.child_id = next_child.id 
   JOIN children c ON stakeholder.stakeholder_relation.parent_id = c.id
)
SELECT *
FROM children
$$
LANGUAGE SQL;
