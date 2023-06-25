using Messages.Contracts.Data;
using Messages.Contracts.Responses;

namespace Messages.SignalR.Hubs;

public interface IMessagesHub
{
    Task ReceiveMessage(ReceiveMessageResponse response);
    Task GetMessagesWithUser(GetMessagesWithUserResponse response);
    Task GetLatestMessages(GetLatestMessagesResponse response);
    Task GetLatestUserMessages(GetLatestUserMessagesResponse response);
    Task GetLatestGroupChatMessages(GetLatestGroupChatMessagesResponse response);

    Task GetGroupChatMessages(GetGroupChatMessagesResponse response);

    Task GroupChatMembersAdded(GroupChatMembersAddedResponse response);

    Task GroupChatMembersRemoved(GroupChatMembersRemovedResponse response);
}
