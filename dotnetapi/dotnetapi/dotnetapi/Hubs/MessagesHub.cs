using dotnetapi.Extensions;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Handlers;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Hubs;

public interface IMessagesHub
{
    Task GetNewMessage(MessageDto message);
}

public class MessagesHub : Hub
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<MessagesHub> _logger;
    private readonly IMediator _mediator;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public MessagesHub(UserManager<AppUser> userManager,
        IMessagesRepository messagesRepository,
        IGroupChatsRepository groupChatsRepository,
        IMediator mediator,
        ILogger<MessagesHub> logger)
    {
        _userManager = userManager;
        _messagesRepository = messagesRepository;
        _groupChatsRepository = groupChatsRepository;
        _mediator = mediator;
        _logger = logger;
    }


    public async Task GetMessages(string username)
    {
        var appUser = await _userManager.Users.Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync();
        if (appUser is null) throw new HubException("appUser is null");
        var recipient = await _userManager.Users.Where(x => x.UserName == username).SingleOrDefaultAsync();
        if (recipient is null) throw new HubException("recipient is null");

        _logger.LogInformation("{User} GetMessages with {Recipient}", appUser.UserName!, recipient.UserName!);
        var messages = await _mediator.Send(new GetUserMessagesByUserNameQuery(appUser, recipient));
        // var messages = await _messagesRepository.GetUserMessagesAsync(appUser, recipient);
        await Clients.Caller.SendAsync("GetMessages", messages);
    }

    public async Task GetGroupChatMessages(int groupChatId)
    {
        var appUser = await _userManager.Users.Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync();
        if (appUser is null) throw new HubException("appUser is null");

        var groupChatMessages = await _mediator.Send(new GetGroupChatMessagesByIdQuery(appUser, groupChatId));
        // var groupChatMessages = await _messagesRepository.GetGroupChatMessagesAsync(groupChatId);
        if (groupChatMessages is null) throw new HubException("groupChatMessages is null");
        var chatMessageDtos = groupChatMessages.ToList();
        var messageIds = chatMessageDtos.Select(x => x.Id).ToList();
        var update = await _messagesRepository.MarkAllGroupChatMessagesReadByUserAsync(messageIds, appUser);


        _logger.LogInformation("{User} GetMessages with Group {Group}", appUser.UserName!, groupChatId);

        await Clients.Caller.SendAsync("GetGroupChatMessages", groupChatMessages);

        var serverMessages = await _mediator.Send(new GetGroupChatServerMessagesByGroupIdQuery(groupChatId));
        if (serverMessages is null) throw new HubException("serverMessages is null");

        await Clients.Caller.SendAsync("GetGroupChatServerMessages", serverMessages);
    }

    public async Task SendMessageToUser(SendMessageRequest request)
    {
        var appUser = await _userManager.Users.Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync();
        if (appUser is null) throw new HubException("appUser is null");

        var recipient = await _userManager.Users.Where(x => x.UserName == request.RecipientUserName)
            .SingleOrDefaultAsync();
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            throw new HubException("Recipient is invalid");
        }

        var message = request.ToEntity(appUser, recipient);

        var result = await _messagesRepository.AddMessageAsync(message);

        _logger.LogInformation("{User} Sent a Message To User {Recipient}", appUser.UserName!, recipient.UserName!);

        await Clients.Users(appUser.UserName!, recipient.UserName!)
            .SendAsync("GetMessages", result.ToDto(appUser));
    }

    public async Task SendMessageToGroupChat(SendGroupChatMessageRequest request)
    {
        var appUser = await _userManager.Users.Where(x => x.UserName == Context.User!.GetUsername())
            .SingleOrDefaultAsync();
        if (appUser is null) throw new HubException("appUser is null");

        // var appUserGroupChat = await _mediator.Send(new).GetAppUserGroupChatAsync(appUser, request.GroupChatId);
        var appUserGroupChat = await _groupChatsRepository.GetAppUserGroupChatAsync(appUser, request.GroupChatId);
        if (appUserGroupChat is null)
        {
            _logger.LogError("Bad request, appUserGroupChat is invalid");
            throw new HubException("appUserGroupChat is invalid");
        }

        var groupChatMemberDtos = await _mediator.Send(new GetGroupChatMembersByIdQuery(request.GroupChatId));
        // var groupChatMemberDtos = await _groupChatsRepository.GetGroupChatMembersAsync(request.GroupChatId);

        var chatMemberDtos = groupChatMemberDtos.ToList();
        var isUserInGroupChat = chatMemberDtos.FirstOrDefault(x => x.UserName == appUser.UserName!);
        if (isUserInGroupChat is null)
        {
            _logger.LogError("Bad request, user is not in conversation");
            throw new HubException("Bad request, user is not in conversation");
        }

        var groupChatMessage = request.ToEntity(appUser, appUserGroupChat.GroupChat);

        // var groupChatMessageDto = await _mediator.Send(new SendMessageToGroupChatQuery(groupChatMessage));
        var groupChatMessageDto = await _messagesRepository.SendMessageToGroupChatAsync(groupChatMessage, appUser);

        var groupChatUsers = chatMemberDtos.Select(x => x.UserName).ToArray();
        // var groupChatUsernames = await _groupChatsRepository.GetGroupChatMembersAsync()

        _logger.LogInformation("{User} Sent a Message To Group {Recipient}", appUser.UserName!,
            appUserGroupChat.GroupChat.Name!);

        await Clients.Users(groupChatUsers)
            .SendAsync("GetGroupChatMessages", groupChatMessageDto);
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