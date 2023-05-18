CREATE TABLE app_config (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_code text NOT NULL UNIQUE,
    stakeholder_id uuid NOT NULL REFERENCES stakeholder(id),
    capture_flow jsonb,
    capture_setup_flow jsonb,
    active boolean DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);