ALTER TABLE stakeholder ADD COLUMN status varchar NOT NULL DEFAULT 'active'
  CHECK (status IN ('pending', 'active', 'suspended', 'rejected'));
ALTER TABLE stakeholder ADD COLUMN rejection_reason varchar;
