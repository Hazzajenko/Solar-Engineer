namespace Projects.Contracts.Requests.Panels;

public class UpdatePanelRequest : IProjectEventRequest
{
    public required string ProjectId { get; init; }

    public required ProjectItemUpdateRequest<PanelChanges> Update { get; init; }
}

public class UpdatePanelRequestValidator : AbstractValidator<UpdatePanelRequest>
{
    public UpdatePanelRequestValidator()
    {
        RuleFor(v => v.Update.Id)
            .NotNull()
            .WithMessage("Id cannot be null")
            .NotEmpty()
            .WithMessage("Id cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("Id must be a valid Guid");

        RuleFor(v => v.ProjectId)
            .NotNull()
            .WithMessage("ProjectId cannot be null")
            .NotEmpty()
            .WithMessage("ProjectId cannot be empty")
            .Must(x => Guid.TryParse(x, out _))
            .WithMessage("ProjectId must be a valid Guid");

        RuleFor(v => v.Update.Changes)
            .NotNull()
            .WithMessage("Changes cannot be null")
            .NotEmpty()
            .WithMessage("Changes cannot be empty")
            .Must(x => x.Location is not null || x.PanelConfigId is not null || x.Angle is not null)
            .WithMessage("Changes cannot be empty");
    }
}
