CREATE TABLE stakeholder.organization_user (
    organization_id uuid NOT NULL REFERENCES stakeholder.stakeholder(id),
    keycloak_user_id uuid NOT NULL,
    permissions text[] NOT NULL DEFAULT ARRAY['verify_captures']::text[],
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid NOT NULL,
    PRIMARY KEY (organization_id, keycloak_user_id),
    CHECK (array_position(permissions, NULL) IS NULL),
    CHECK (permissions <@ ARRAY[
        'verify_captures','manage_projects','manage_species','view_contracts','manage_members'
    ]::text[])
);
COMMENT ON TABLE stakeholder.organization_user IS
    'Organization-scoped admin permissions. Keycloak identity and approved membership are validated by the API. Added through Admin Panel domain integration.';
