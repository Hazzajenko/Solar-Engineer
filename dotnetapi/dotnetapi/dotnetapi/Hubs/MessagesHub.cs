using dotnetapi.Extensions;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Handlers;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Hubs;

public interface IMessagesHub
{
    Task GetMessages(IEnumerable<MessageDto> messages, CancellationToken ct);

    Task GetGroupChatMessages(
        IEnumerable<GroupChatMessageDto> groupChatMessages,
        CancellationToken ct
    );

    Task GetGroupChatServerMessages(
        IEnumerable<GroupChatServerMessageDto> serverMessages,
        CancellationToken ct
    );

    Task UpdateGroupChatMessages(
        IEnumerable<GroupChatMessageUpdateDto> groupChatMessageUpdates,
        CancellationToken ct
    );

    Task AddGroupChatMembers(
        IEnumerable<InitialGroupChatMemberDto> groupChatMembers,
        CancellationToken ct
    );

    Task RemoveGroupChatMembers(IEnumerable<int> groupChatMemberIds, CancellationToken ct);
}

public class MessagesHub : Hub<IMessagesHub>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<MessagesHub> _logger;
    private readonly IMediator _mediator;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public MessagesHub(
        UserManager<AppUser> userManager,
        IMessagesRepository messagesRepository,
        IGroupChatsRepository groupChatsRepository,
        IMediator mediator,
        ILogger<MessagesHub> logger
    )
    {
        _userManager = userManager;
        _messagesRepository = messagesRepository;
        _groupChatsRepository = groupChatsRepository;
        _mediator = mediator;
        _logger = logger;
    }

    public async Task GetMessages(string username)
    {
        var appUser = await _userManager.Users
            .Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync(CancellationToken.None);
        if (appUser is null)
            throw new HubException("appUser is null");
        var recipient = await _userManager.Users
            .Where(x => x.UserName == username)
            .SingleOrDefaultAsync(CancellationToken.None);
        if (recipient is null)
            throw new HubException("recipient is null");

        _logger.LogInformation(
            "{User} GetMessages with {Recipient}",
            appUser.UserName!,
            recipient.UserName!
        );
        var messages = await _mediator.Send(
            new GetUserMessagesByUserNameQuery(appUser, recipient),
            CancellationToken.None
        );
        // var messages = await _messagesRepository.GetUserMessagesAsync(appUser, recipient);
        await Clients.Caller.GetMessages(messages, CancellationToken.None);
    }

    public async Task GetGroupChatMessages(int groupChatId)
    {
        /*var appUser = await _userManager.Users
            .Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync(CancellationToken.None);*/
        var appUser = await _mediator.Send(new GetUserByUserNameQuery(Context.User!.GetUsername()));
        if (appUser is null)
            throw new HubException("appUser is null");

        /*var groupChatMessages = await _mediator.Send(
            new GetGroupChatMessagesByIdQuery(appUser, groupChatId),
            CancellationToken.None
        );
        // var groupChatMessages = await _messagesRepository.GetGroupChatMessagesAsync(groupChatId);
        if (groupChatMessages is null)
            throw new HubException("groupChatMessages is null");
        var chatMessageDtos = groupChatMessages.ToList();
        var messageIds = chatMessageDtos.Select(x => x.Id).ToList();*/
        /*var update = await _messagesRepository.MarkAllGroupChatMessagesReadByUserAsync(
            messageIds,
            appUser
        );*/

        var update = await _mediator.Send(
            new MarkAllGroupChatMessagesReadCommand(groupChatId, appUser)
        );
        // if (!update) throw new HubException("unable to read messages");

        _logger.LogInformation(
            "{User} GetMessages with Group {Group}",
            appUser.UserName!,
            groupChatId
        );

        var groupChatMessages = await _mediator.Send(
            new GetGroupChatMessagesByIdQuery(appUser, groupChatId),
            CancellationToken.None
        );

        await Clients.Caller.GetGroupChatMessages(groupChatMessages, CancellationToken.None);

        var serverMessages = await _mediator.Send(
            new GetGroupChatServerMessagesByGroupIdQuery(groupChatId),
            CancellationToken.None
        );
        if (serverMessages is null)
            throw new HubException("serverMessages is null");

        await Clients.Caller.GetGroupChatServerMessages(serverMessages, CancellationToken.None);
    }

    public async Task SendMessageToUser(SendMessageRequest request)
    {
        /*var appUser = await _userManager.Users
            .Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync(CancellationToken.None);*/
        var appUser = await _userManager.GetUserAsync(Context.User!);
        if (appUser is null)
            throw new HubException("appUser is null");

        var recipient = await _mediator.Send(new GetUserByUserNameQuery(request.RecipientUserName));
        /*var recipient = await _userManager.Users
            .Where(x => x.UserName == request.RecipientUserName)
            .SingleOrDefaultAsync(CancellationToken.None);*/
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            throw new HubException("Recipient is invalid");
        }

        var message = request.ToEntity(appUser, recipient);

        var result = await _messagesRepository.AddMessageAsync(message);

        _logger.LogInformation(
            "{User} Sent a Message To User {Recipient}",
            appUser.UserName!,
            recipient.UserName!
        );

        var newMessage = result.ToDto(appUser);

        await Clients
            .Users(appUser.UserName!, recipient.UserName!)
            .GetMessages(new List<MessageDto> { newMessage }, CancellationToken.None);
        /*await Clients.Users(appUser.UserName!, recipient.UserName!)
            .GetMessages(result.ToDto(appUser));*/
    }

    public async Task SendMessageToGroupChat(SendGroupChatMessageRequest request)
    {
        var appUser = await _userManager.GetUserAsync(Context.User!);

        if (appUser is null)
            throw new HubException("appUser is null");

        var appUserGroupChat = await _mediator.Send(
            new GetAppUserGroupChatQuery(appUser, request.GroupChatId)
        );

        if (appUserGroupChat is null)
        {
            _logger.LogError("Bad request, appUserGroupChat is invalid");
            throw new HubException("appUserGroupChat is invalid");
        }

        var otherUserNames = await _mediator.Send(request.ToGroupChatMemberUserNamesQuery(appUser));

        var result = await _mediator.Send(
            request.ToSendGroupChatMessageQuery(appUser, appUserGroupChat.GroupChat)
        );
        var userMessage = result.ToDto(appUser);
        var otherUsersMessage = result.ToOtherUsersDto();

        _logger.LogInformation(
            "{User} Sent a Message To Group {Group}",
            appUser.UserName!,
            appUserGroupChat.GroupChat.Name!
        );

        await Clients
            .User(appUser.UserName!)
            .GetGroupChatMessages(
                new List<GroupChatMessageDto> { userMessage },
                CancellationToken.None
            );
        await Clients
            .Users(otherUserNames)
            .GetGroupChatMessages(
                new List<GroupChatMessageDto> { otherUsersMessage },
                CancellationToken.None
            );
    }

    private async Task<Group> AddToGroup(string groupName)
    {
        /*var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
        var connection = new DbLoggerCategory.Database.Connection(Context.ConnectionId, Context.User.GetUsername());

        if (group == null)
        {
            group = new Group(groupName);
            _unitOfWork.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        if (await _unitOfWork.Complete()) return group;*/

        throw new HubException("Failed to join group");
    }

    private async Task<Group> RemoveFromMessageGroup()
    {
        /*var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
        _unitOfWork.MessageRepository.RemoveConnection(connection);
        if (await _unitOfWork.Complete()) return group;*/

        throw new HubException("Failed to remove from group");
    }
}