CREATE TABLE IF NOT EXISTS inverters (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    version integer NOT NULL DEFAULT 1,
    model integer NOT NULL DEFAULT 0,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    tracker_amount integer NOT NULL,
    ac_nominal_output bigint NOT NULL,
    ac_output_current bigint NOT NULL,
    european_efficiency bigint NOT NULL,
    max_input_current bigint NOT NULL,
    max_output_power bigint NOT NULL,
    mpp_voltage_range_low bigint NOT NULL,
    mpp_voltage_range_high bigint NOT NULL,
    start_up_voltage bigint NOT NULL
);

/*CREATE TABLE IF NOT EXISTS projects_inverters (
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    PRIMARY KEY (project_id, inverter_id)
/*    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id),
    CONSTRAINT fk_inverters FOREIGN KEY(inverter_id) REFERENCES inverters(id)*/
);*/