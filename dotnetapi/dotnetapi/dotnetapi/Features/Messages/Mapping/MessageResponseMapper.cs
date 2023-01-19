using dotnetapi.Features.Messages.Entities;
using FastEndpoints;

namespace dotnetapi.Features.Messages.Mapping;

public abstract class MessageResponseMapper : ResponseMapper<MessageDto, Message>
{
    public override MessageDto FromEntity(Message e)
    {
        return new MessageDto
        {
            Id = e.Id,
            Content = e.Content,
            MessageReadTime = e.MessageReadTime,
            MessageSentTime = e.MessageSentTime,
            RecipientUsername = e.RecipientUsername,
            SenderUsername = e.SenderUsername
        };
    }
}