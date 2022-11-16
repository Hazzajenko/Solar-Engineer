CREATE TABLE IF NOT EXISTS panels (
    id bigserial PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    string_id bigint NOT NULL REFERENCES strings ON DELETE CASCADE,
    name text NOT NULL,
    model integer NOT NULL DEFAULT 4,
    location text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    current_at_maximum_power real NOT NULL DEFAULT 0,
    short_circuit_current real NOT NULL DEFAULT 0,
    short_circuit_current_temp real NOT NULL DEFAULT 0,
    maximum_power real NOT NULL DEFAULT 0,
    maximum_power_temp real NOT NULL DEFAULT 0,
    voltage_at_maximum_power real NOT NULL DEFAULT 0,
    open_circuit_voltage real NOT NULL DEFAULT 0,
    open_circuit_voltage_temp real NOT NULL DEFAULT 0,
    length bigint NOT NULL DEFAULT 0,
    weight real NOT NULL DEFAULT 0,
    width bigint NOT NULL DEFAULT 0,
    version integer NOT NULL DEFAULT 1,
    color text NOT NULL DEFAULT 'red',
    type text NOT NULL DEFAULT 'PANEL'
);

/*CREATE TABLE IF NOT EXISTS strings_panels (
    string_id bigint NOT NULL REFERENCES strings ON DELETE CASCADE,
    panel_id bigint NOT NULL REFERENCES panels ON DELETE CASCADE,
    panel_amount bigint NOT NULL DEFAULT 0,
    PRIMARY KEY (string_id, panel_id),
    CONSTRAINT fk_strings FOREIGN KEY(string_id) REFERENCES strings(id),
    CONSTRAINT fk_panels FOREIGN KEY(panel_id) REFERENCES panels(id)
);*/