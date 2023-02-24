using Messages.API.Contracts.Data;

namespace Messages.API.Hubs;

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