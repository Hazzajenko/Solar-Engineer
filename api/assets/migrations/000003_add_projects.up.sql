CREATE TABLE IF NOT EXISTS projects (
    id bigserial PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp(0) with time zone NOT NULL DEFAULT NOW(),
    created_by bigserial NOT NULL REFERENCES users ON DELETE CASCADE,
    version integer NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS users_projects (
    user_id bigint NOT NULL REFERENCES users ON DELETE CASCADE,
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    role int NOT NULL default 1,
    PRIMARY KEY (user_id, project_id),
    CONSTRAINT fk_users FOREIGN KEY(user_id) REFERENCES users(id),
    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id)
);