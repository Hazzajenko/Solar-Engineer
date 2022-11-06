CREATE TABLE IF NOT EXISTS strings (
    id bigserial PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    is_in_parallel bool NOT NULL DEFAULT false,
    panel_amount bigint NOT NULL DEFAULT 0,
    version integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS trackers_strings (
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    string_id bigint NOT NULL REFERENCES strings ON DELETE CASCADE,
    PRIMARY KEY (tracker_id, string_id),
    CONSTRAINT fk_trackers FOREIGN KEY(tracker_id) REFERENCES trackers(id),
    CONSTRAINT fk_strings FOREIGN KEY(string_id) REFERENCES strings(id)
);