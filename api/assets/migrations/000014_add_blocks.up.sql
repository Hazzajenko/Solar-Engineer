CREATE TABLE IF NOT EXISTS blocks (
    id                 text   not null,
    project_id         bigint not     null,
    model      integer                     default 0             not null,
    location   text                        default 'undefined'::text   not null,
    constraint blocks_id_pk
     primary key (id),
    constraint blocks_project_id_fk
     foreign key (project_id) references projects
);