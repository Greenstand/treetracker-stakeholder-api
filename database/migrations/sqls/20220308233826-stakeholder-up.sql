CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE stakeholder (
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    type varchar NOT NULL,
    org_name varchar,
    first_name varchar,
    last_name varchar,
    email varchar,
    phone varchar,
    website varchar,
    logo_url varchar,
    map varchar,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
