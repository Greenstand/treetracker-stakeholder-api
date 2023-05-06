CREATE TABLE app_installation(
    id uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet varchar NOT NULL,
    app_config_id uuid NOT NULL REFERENCES app_config(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    latest_login_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX wallet_app_config
  ON app_installation(wallet, app_config_id);