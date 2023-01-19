using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Entities;
using FastEndpoints;

namespace dotnetapi.Features.Messages.Mapping;

public abstract class MessagesMapper : Mapper<SendMessageRequest, MessageDto, Message>
{
    /*public override Message ToEntity(SendMessageRequest r, AppUser appUser)
    {
        return new()
        {
            Id = r.Id,
            Content = r.Content,
            DateRead = r.DateRead,
            MessageSent = r.MessageSent,
            RecipientUsername = r.RecipientUsername,
            SenderUsername = r.SenderUsername,
        };
    }*/

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