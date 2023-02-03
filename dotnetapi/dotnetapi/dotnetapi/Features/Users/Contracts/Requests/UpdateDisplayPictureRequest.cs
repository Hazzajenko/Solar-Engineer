using dotnetapi.Features.Images.Entities;
using FluentValidation;

namespace dotnetapi.Features.Users.Contracts.Requests;

public class UpdateDisplayPictureRequest
{
    public string UserName { get; set; } = default!;
    public S3ImageDto Image { get; set; } = default!;
}

public class UpdateDisplayPictureRequestValidator : AbstractValidator<UpdateDisplayPictureRequest>
{
    public UpdateDisplayPictureRequestValidator()
    {
        RuleFor(v => v.Image)
            .NotNull()
            .WithMessage("Image cannot be null")
            .NotEmpty()
            .WithMessage("Image cannot be empty");
    }
}