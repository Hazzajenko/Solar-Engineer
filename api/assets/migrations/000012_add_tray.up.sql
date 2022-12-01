CREATE TABLE IF NOT EXISTS tray (
    id                 text   not null,
    project_id         bigint not     null,
    model      integer                     default 9             not null,
    location   text                        default 'undefined'::text   not null,
    size       bigint                      default 4             not null,
    color      text                        default 'black'::text not null,
    type       text                        default 'TRAY'::text not null,

    constraint tray_id_pk
    primary key (id),
    constraint tray_project_id_fk
    foreign key (project_id) references projects
);