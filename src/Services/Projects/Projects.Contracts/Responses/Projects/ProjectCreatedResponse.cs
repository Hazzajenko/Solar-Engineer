﻿using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Projects;

public class ProjectCreatedResponse
{
    public ProjectDto Project { get; set; } = default!;
}

public class ProjectCreatedWithTemplateResponse
{
    public ProjectDataDto Project { get; set; } = default!;
}
