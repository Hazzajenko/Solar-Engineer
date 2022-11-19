/*CREATE TABLE IF NOT EXISTS inverters (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    version integer NOT NULL DEFAULT 1,
    model integer NOT NULL DEFAULT 1,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    tracker_amount integer NOT NULL,
    ac_nominal_output real NOT NULL,
    ac_output_current real NOT NULL,
    european_efficiency real NOT NULL,
    max_input_current real NOT NULL,
    max_output_power real NOT NULL,
    mpp_voltage_range_low real NOT NULL,
    mpp_voltage_range_high real NOT NULL,
    start_up_voltage real NOT NULL,
    type text NOT NULL DEFAULT 'INVERTER'

);*/

create table if not exists inverters
(
    id                     text                        default 'err'::text      not null,
    name                   text                                                 not null,
    created_at             timestamp(0) with time zone default now()            not null,
    created_by             bigserial,
    version                integer                     default 1                not null,
    project_id             bigint                                               not null,
    tracker_amount         integer                                              not null,
    ac_nominal_output      bigint                                               not null,
    ac_output_current      bigint                                               not null,
    european_efficiency    bigint                                               not null,
    max_input_current      bigint                                               not null,
    max_output_power       bigint                                               not null,
    mpp_voltage_range_low  bigint                                               not null,
    mpp_voltage_range_high bigint                                               not null,
    start_up_voltage       bigint                                               not null,
    model                  integer                     default 2                not null,
    type                   text                        default 'INVERTER'::text not null,
    location               text                        default 'inv'::text      not null,
    color               text                        default 'blue'::text      not null,
    primary key (id),
    foreign key (created_by) references users
        on delete cascade,
    foreign key (project_id) references projects
        on delete cascade
);







/*CREATE TABLE IF NOT EXISTS projects_inverters (
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    PRIMARY KEY (project_id, inverter_id)
/*    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id),
    CONSTRAINT fk_inverters FOREIGN KEY(inverter_id) REFERENCES inverters(id)*/
);*/