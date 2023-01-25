namespace dotnetapi.Features.Messages.Entities;

public class UserToUserChatDto
{
    public string MessagesWith { get; set; } = default!;
    public ICollection<Message> Messages { get; set; } = default!;
}