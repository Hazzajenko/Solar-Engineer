using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Features.Messages.Contracts.Requests;

public class UpdateManyMessagesRequest
{
    [Required]
    public IEnumerable<UpdateMessageRequest> Updates { get; init; } =
        Enumerable.Empty<UpdateMessageRequest>();
}