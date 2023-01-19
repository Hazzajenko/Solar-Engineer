using System.ComponentModel.DataAnnotations;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Messages.Contracts.Requests;

public class UpdateMessageRequest
{
    [Required] public int Id { get; set; } = default!;
    [Required] public MessageChanges Changes { get; set; } = default!;
}

public class MessageChanges
{
    public NotificationStatus? Status { get; set; }
}