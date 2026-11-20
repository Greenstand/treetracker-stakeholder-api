ALTER TABLE stakeholder.project
    ADD COLUMN logo_url text,
    ADD COLUMN hero_image_url text,
    ADD COLUMN target_captures integer CHECK (target_captures >= 0);
