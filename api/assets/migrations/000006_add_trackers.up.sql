CREATE TABLE IF NOT EXISTS trackers (
    id bigserial PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    name text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    max_input_current bigint NOT NULL DEFAULT 0,
    max_short_circuit_current bigint NOT NULL DEFAULT 0,
    string_amount bigint NOT NULL DEFAULT 0,
    parallel_amount bigint NOT NULL DEFAULT 0,
    panel_amount bigint NOT NULL DEFAULT 0,
    version integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS inverters_trackers (
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    PRIMARY KEY (inverter_id, tracker_id),
    CONSTRAINT fk_inverters FOREIGN KEY(inverter_id) REFERENCES inverters(id),
    CONSTRAINT fk_trackers FOREIGN KEY(tracker_id) REFERENCES trackers(id)
);