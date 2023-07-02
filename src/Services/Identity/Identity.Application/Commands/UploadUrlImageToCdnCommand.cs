using Identity.Domain;
using Mediator;

namespace Identity.Application.Commands;

public record UploadUrlImageToCdnCommand(AppUser AppUser) : ICommand<UploadUrlImageToCdnResponse>;

public class UploadUrlImageToCdnResponse
{
    public string PhotoUrl { get; set; } = default!;
}
