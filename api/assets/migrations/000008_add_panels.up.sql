/*CREATE TABLE IF NOT EXISTS panels (
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
);*/

create table if not exists panels
(
    id                         text                        default 'err'::text   not null,
    project_id                 bigint                                            not null,
    inverter_id                text                        default 'err'::text   not null,
    tracker_id                 text                        default 'err'::text   not null,
    string_id                  text                        default 'err'::text   not null,
    name                       text                                              not null,
    positive_to_id                       text                    default 'null'::text                          not null,
    negative_to_id                        text                    default 'null'::text                          not null,
    created_at                 timestamp(0) with time zone default now()         not null,
    created_by                 bigserial,
    current_at_maximum_power   real                        default 0             not null,
    short_circuit_current      real                        default 0             not null,
    short_circuit_current_temp real                        default 0             not null,
    maximum_power              real                        default 0             not null,
    maximum_power_temp         real                        default 0             not null,
    voltage_at_maximum_power   real                        default 0             not null,
    open_circuit_voltage       real                        default 0.00          not null,
    open_circuit_voltage_temp  real                        default 0             not null,
    length                     bigint                      default 0             not null,
    weight                     real                        default 0             not null,
    width                      bigint                      default 0             not null,
    version                    integer                     default 1             not null,
    location                   text                        default 'inv'::text   not null,
    model                      integer                     default 5             not null,
    color                      text                        default 'red'::text   not null,
    type                       text                        default 'PANEL'::text not null,
    primary key (id),
    foreign key (project_id) references projects
        on delete cascade,
    foreign key (created_by) references users
        on delete cascade,
    foreign key (string_id) references strings
        on update cascade on delete cascade,
    foreign key (inverter_id) references inverters
        on update cascade on delete cascade,
    foreign key (tracker_id) references trackers
        on update cascade on delete cascade,
    foreign key (positive_to_id) references panels
        on update cascade on delete cascade,
    foreign key (negative_to_id) references panels
        on update cascade on delete cascade
);

CREATE TABLE IF NOT EXISTS panel_joins (
    id text default 'err'::text NOT NULL,
    positive_id text NOT NULL REFERENCES panels ON DELETE CASCADE,
    negative_id text NOT NULL REFERENCES panels ON DELETE CASCADE,
    PRIMARY KEY (positive_id, negative_id)
--     PRIMARY KEY (id),
--     CONSTRAINT fk_positive_id FOREIGN KEY(positive_id) REFERENCES panels(id),
--     CONSTRAINT fk_negative_id FOREIGN KEY(negative_id) REFERENCES panels(id)
);




/*CREATE TABLE IF NOT EXISTS strings_panels (
    string_id bigint NOT NULL REFERENCES strings ON DELETE CASCADE,
    panel_id bigint NOT NULL REFERENCES panels ON DELETE CASCADE,
    panel_amount bigint NOT NULL DEFAULT 0,
    PRIMARY KEY (string_id, panel_id),
    CONSTRAINT fk_strings FOREIGN KEY(string_id) REFERENCES strings(id),
    CONSTRAINT fk_panels FOREIGN KEY(panel_id) REFERENCES panels(id)
);*/