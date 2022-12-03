CREATE TABLE IF NOT EXISTS rails (
    id                 text   not null,
    project_id         bigint not     null,
    model      integer                     default 10             not null,
    location   text                        default 'undefined'::text   not null,
    type       text                        default 'SUNLOCK'::text not null,
    constraint rails_id_pk
    primary key (id),
    constraint rails_project_id_fk
    foreign key (project_id) references projects
);