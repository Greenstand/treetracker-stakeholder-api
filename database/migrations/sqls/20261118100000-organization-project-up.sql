CREATE TABLE stakeholder.project (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid NOT NULL REFERENCES stakeholder.stakeholder(id),
    code text NOT NULL CHECK (code <> '' AND code = btrim(code)),
    name text NOT NULL CHECK (btrim(name) <> ''),
    status text NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'suspended', 'archived')),
    description text,
    starts_on date,
    ends_on date,
    target_trees integer CHECK (target_trees >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (ends_on >= starts_on)
);

CREATE UNIQUE INDEX project_organization_code_idx
    ON stakeholder.project (organization_id, lower(code));

CREATE TABLE stakeholder.project_grower (
    project_id uuid NOT NULL REFERENCES stakeholder.project(id),
    grower_account_id uuid NOT NULL,
    joined_at timestamptz NOT NULL DEFAULT now(),
    left_at timestamptz,
    PRIMARY KEY (project_id, grower_account_id),
    CHECK (left_at >= joined_at)
);

CREATE INDEX project_grower_account_idx ON stakeholder.project_grower (grower_account_id);
