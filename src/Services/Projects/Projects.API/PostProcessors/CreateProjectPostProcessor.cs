/*using FastEndpoints;
using FluentValidation.Results;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;

namespace Projects.API.PostProcessors;

public class CreateProjectPostProcessor : IPostProcessor<CreateProjectRequest, ProjectCreatedWithTemplateResponse>
{
    public Task PostProcessAsync(CreateProjectRequest req, ProjectCreatedWithTemplateResponse res, HttpContext ctx, IReadOnlyCollection<ValidationFailure> failures, CancellationToken ct)
    {
        var logger = ctx.Resolve<ILogger<ProjectCreatedWithTemplateResponse>>();


        return Task.CompletedTask;
    }
}*/
