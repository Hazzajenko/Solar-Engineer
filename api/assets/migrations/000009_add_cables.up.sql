CREATE TABLE IF NOT EXISTS cables (
    id bigserial PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    model integer NOT NULL DEFAULT 5,
    location text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    length bigint NOT NULL DEFAULT 0,
    weight real NOT NULL DEFAULT 0,
    version integer NOT NULL DEFAULT 1,
    size bigint NOT NULL DEFAULT 4,
    color text NOT NULL DEFAULT 'black',
    type text NOT NULL DEFAULT 'CABLE'
);
