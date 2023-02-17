using Infrastructure.Data;
using Messages.API.Repositories.GroupChatMessages;
using Messages.API.Repositories.GroupChats;
using Messages.API.Repositories.GroupChatServerMessages;
using Messages.API.Repositories.Messages;
using Messages.API.Repositories.UserGroupChats;
using Messages.API.Repositories.Users;

namespace Messages.API.Data;

public interface IMessagesUnitOfWork : IUnitOfWorkFactory
{
    IUsersRepository UsersRepository { get; }
    IUserGroupChatsRepository UserGroupChatsRepository { get; }
    IMessagesRepository MessagesRepository { get; }
    IGroupChatsRepository GroupChatsRepository { get; }
    IGroupChatMessagesRepository GroupChatMessagesRepository { get; }
    IGroupChatServerMessagesRepository GroupChatServerMessagesRepository { get; }
}