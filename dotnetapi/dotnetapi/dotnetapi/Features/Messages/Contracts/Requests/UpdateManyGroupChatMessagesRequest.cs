using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Features.Messages.Contracts.Requests;

public class UpdateManyGroupChatMessagesRequest
{
    [Required]
    public IEnumerable<UpdateGroupChatMessageRequest> Updates { get; init; } =
        Enumerable.Empty<UpdateGroupChatMessageRequest>();
}