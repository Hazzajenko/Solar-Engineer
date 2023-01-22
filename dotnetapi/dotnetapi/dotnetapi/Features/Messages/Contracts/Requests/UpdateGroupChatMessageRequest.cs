using System.ComponentModel.DataAnnotations;
using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.Messages.Contracts.Requests;

public class UpdateGroupChatMessageRequest
{
    [Required] public int Id { get; set; } = default!;
    [Required] public GroupChatMessageChanges Changes { get; set; } = default!;
}

public abstract class GroupChatMessageChanges
{
    public IEnumerable<GroupChatReadTimeDto>? MessageReadTimes { get; set; }
    public bool? SenderDeleted { get; set; }
}