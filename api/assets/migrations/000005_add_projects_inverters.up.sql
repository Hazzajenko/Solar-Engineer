CREATE TABLE IF NOT EXISTS projects_inverters (
    project_id bigint NOT NULL REFERENCES projects ON DELETE CASCADE,
    inverter_id bigint NOT NULL REFERENCES inverters ON DELETE CASCADE,
    PRIMARY KEY (project_id, inverter_id),
    CONSTRAINT fk_projects FOREIGN KEY(project_id) REFERENCES projects(id),
    CONSTRAINT fk_inverters FOREIGN KEY(inverter_id) REFERENCES inverters(id)
);