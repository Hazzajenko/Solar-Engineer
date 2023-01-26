using dotnetapi.Data;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;

namespace dotnetapi.Features.Messages.Handlers;

public sealed record SendMessageToGroupChatQuery
    (GroupChatMessage Message, AppUser AppUser) : IRequest<GroupChatMessageDto>;

public class
    SendMessageToGroupChatHandler : IRequestHandler<SendMessageToGroupChatQuery, GroupChatMessageDto>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SendMessageToGroupChatHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<GroupChatMessageDto>
        Handle(SendMessageToGroupChatQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        await db.GroupChatMessages.AddAsync(request.Message, cT);
        await db.SaveChangesAsync(cT);

        return request.Message.ToDto(request.AppUser);
    }
}