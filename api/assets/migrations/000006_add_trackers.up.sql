/*CREATE TABLE IF NOT EXISTS trackers (
    id bigserial PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    name text NOT NULL,
    model integer NOT NULL DEFAULT 2,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    max_input_current real NOT NULL DEFAULT 0,
    max_short_circuit_current real NOT NULL DEFAULT 0,
    string_amount bigint NOT NULL DEFAULT 0,
    parallel_amount bigint NOT NULL DEFAULT 0,
    panel_amount bigint NOT NULL DEFAULT 0,
    version integer NOT NULL DEFAULT 1,
    type text NOT NULL DEFAULT 'TRACKER'
);
*/
create table if not exists trackers
(
    id                        text                        default 'err'::text     not null,
    project_id                bigint                                              not null,
    inverter_id               text                        default 'err'::text     not null,
    name                      text                                                not null,
    created_at                timestamp(0) with time zone default now()           not null,
    created_by                bigserial,
    max_input_current         bigint                      default 0               not null,
    max_short_circuit_current bigint                      default 0               not null,
    string_amount             bigint                      default 0               not null,
    parallel_amount           bigint                      default 0               not null,
    panel_amount              bigint                      default 0               not null,
    version                   integer                     default 1               not null,
    model                     integer                     default 3               not null,
    type                      text                        default 'TRACKER'::text not null,
    location                  text                        default 'inv'::text     not null,
    color               text                        default 'orange'::text      not null,
    primary key (id),
    foreign key (project_id) references projects
        on delete cascade,
    foreign key (created_by) references users
        on delete cascade,
    foreign key (inverter_id) references inverters
        on update cascade on delete cascade
);





/*CREATE TABLE IF NOT EXISTS inverters_trackers (
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    PRIMARY KEY (inverter_id, tracker_id),
    CONSTRAINT fk_inverters FOREIGN KEY(inverter_id) REFERENCES inverters(id),
    CONSTRAINT fk_trackers FOREIGN KEY(tracker_id) REFERENCES trackers(id)
);*/