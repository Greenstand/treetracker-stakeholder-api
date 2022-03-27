CREATE FUNCTION getStakeholderChildren
(
  uuid
)
RETURNS TABLE (stakeholder_id uuid, parent_id uuid, depth int, relations_type text, relations_role text)
AS $$
WITH RECURSIVE children AS (
   SELECT id, stakeholder_relation.parent_id, 1 as depth, stakeholder_relation.type, stakeholder_relation.role
   FROM stakeholder
   LEFT JOIN stakeholder_relation ON stakeholder_relation.child_id = id 
   WHERE id = $1
  UNION
   SELECT next_child.id, stakeholder_relation.parent_id, depth + 1, stakeholder_relation.type, stakeholder_relation.role
   FROM stakeholder next_child
   JOIN stakeholder_relation ON stakeholder_relation.child_id = next_child.id 
   JOIN children c ON stakeholder_relation.parent_id = c.id
)
SELECT *
FROM children
$$
LANGUAGE SQL;
