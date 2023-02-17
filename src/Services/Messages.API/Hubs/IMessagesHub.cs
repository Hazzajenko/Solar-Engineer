using Messages.API.Contracts.Data;

namespace Messages.API.Hubs;

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