CREATE TABLE stakeholder_relation (
    parent_id uuid NOT NULL,
    child_id uuid NOT NULL,
    type varchar,
    role varchar,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (parent_id, child_id)
);