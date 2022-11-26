CREATE TABLE IF NOT EXISTS disconnection_points (
    id                 text   not null,
    project_id         bigint not     null,
    string_id          text   not null,
    positive_id        text   not     null,
    negative_id        text   not     null,
    disconnection_type text   default 'MC4'::text not null,
    location text default 'err'::text not null,

    constraint disconnection_points_id_pk
    primary key (id),
    constraint disconnection_points_project_id_fk
    foreign key (project_id) references projects,
    constraint disconnection_points_string_id_fk
    foreign key (string_id) references strings,
    constraint panels_panels_positive_id_fkey
    foreign key (positive_id) references panels
    on delete cascade,
    constraint panels_panels_negative_id_fkey
    foreign key (negative_id) references panels
    on delete cascade
);