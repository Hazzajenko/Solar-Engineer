/*CREATE TABLE IF NOT EXISTS cables (
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
);*/

create table if not exists cables
(
    id         text                        default 'err'::text   not null,
    project_id bigint                                            not null,
    join_id text default 'err'::text not null,
    model      integer                     default 6             not null,
    location   text                        default 'inv'::text   not null,
    created_at timestamp(0) with time zone default now()         not null,
    created_by bigserial,
    length     bigint                      default 0             not null,
    weight     real                        default 0             not null,
    version    integer                     default 1             not null,
    size       bigint                      default 4             not null,
    color      text                        default 'black'::text not null,
    type       text                        default 'CABLE'::text not null,
    primary key (id),
    foreign key (project_id) references projects
        on delete cascade,
    foreign key (join_id) references projects
        on delete cascade,
    foreign key (created_by) references users
        on delete cascade
);



