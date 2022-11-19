/*CREATE TABLE IF NOT EXISTS strings (
    id bigserial PRIMARY KEY,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    name text NOT NULL,
    model integer NOT NULL DEFAULT 3,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    is_in_parallel bool NOT NULL DEFAULT false,
    panel_amount bigint NOT NULL DEFAULT 0,
    version integer NOT NULL DEFAULT 1,
    color text NOT NULL DEFAULT 'red',
    type text NOT NULL DEFAULT 'STRING'
);
*/

create table if not exists strings
(
    id             text                        default 'err'::text    not null,
    project_id     bigint                                             not null,
    inverter_id    text                        default 'err'::text    not null,
    tracker_id     text                        default 'err'::text    not null,
    name           text                                               not null,
    created_at     timestamp(0) with time zone default now()          not null,
    created_by     bigserial,
    is_in_parallel boolean                     default false          not null,
    panel_amount   bigint                      default 0              not null,
    version        integer                     default 1              not null,
    model          integer                     default 4              not null,
    color          text                        default 'red'::text    not null,
    type           text                        default 'STRING'::text not null,
    primary key (id),
    foreign key (project_id) references projects
        on delete cascade,
    foreign key (created_by) references users
        on delete cascade,
    foreign key (inverter_id) references inverters
        on update cascade on delete cascade,
    foreign key (tracker_id) references trackers
        on update cascade on delete cascade
);





/*CREATE TABLE IF NOT EXISTS trackers_strings (
    tracker_id bigint NOT NULL REFERENCES trackers ON DELETE CASCADE,
    string_id bigint NOT NULL REFERENCES strings ON DELETE CASCADE,
    PRIMARY KEY (tracker_id, string_id),
    CONSTRAINT fk_trackers FOREIGN KEY(tracker_id) REFERENCES trackers(id),
    CONSTRAINT fk_strings FOREIGN KEY(string_id) REFERENCES strings(id)
);*/