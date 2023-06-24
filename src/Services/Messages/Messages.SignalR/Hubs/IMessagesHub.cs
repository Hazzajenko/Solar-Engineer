using Messages.Contracts.Data;

namespace Messages.SignalR.Hubs;

public interface IMessagesHub
{
    Task GetMessages(IEnumerable<MessageDto> messages);

    Task GetGroupChatMessages(
        IEnumerable<GroupChatCombinedMessageDto> groupChatMessages
    );

    /*
    Task GetGroupChatServerMessages(
        IEnumerable<GroupChatServerMessageDto> serverMessages
    );*/

    Task UpdateGroupChatMessages(
        IEnumerable<GroupChatMessageUpdateDto> groupChatMessageUpdates
    );

    Task AddGroupChatMembers(
        IEnumerable<InitialGroupChatMemberDto> groupChatMembers
    );

    Task RemoveGroupChatMembers(IEnumerable<string> groupChatMemberIds);
}