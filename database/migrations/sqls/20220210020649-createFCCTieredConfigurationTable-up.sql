CREATE TABLE fcc_tiered_configuration (
	id uuid NULL DEFAULT uuid_generate_v4(),
	start_date timestamptz NOT NULL,
	end_date varchar NOT NULL,
	created_at varchar NOT NULL,
	active bool NOT NULL DEFAULT true
);