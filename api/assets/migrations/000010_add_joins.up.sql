create table if not exists joins
(
    id         text                        default 'err'::text   not null,
    project_id bigint                                            not null,
    model      integer                     default 6             not null,
    created_at timestamp(0) with time zone default now()         not null,
    created_by bigserial,
    size       bigint                      default 4             not null,
    color      text                        default 'purple'::text not null,
    type       text                        default 'JOIN'::text not null,
    blocks text[],
    primary key (id),
    foreign key (project_id) references projects
        on delete cascade,
    foreign key (created_by) references users
        on delete cascade
);