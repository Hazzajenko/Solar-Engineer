using Infrastructure.Data;
using Messages.API.Repositories.GroupChatMessages;
using Messages.API.Repositories.GroupChats;
using Messages.API.Repositories.GroupChatServerMessages;
using Messages.API.Repositories.Messages;
using Messages.API.Repositories.UserGroupChats;
using Messages.API.Repositories.Users;

namespace Messages.API.Data;

public class MessagesUnitOfWork : UnitOfWorkFactory<MessagesContext>, IMessagesUnitOfWork
{
    public MessagesUnitOfWork(MessagesContext context) : base(context)
    {
    }

    public IUsersRepository UsersRepository => new UsersRepository(Context);
    public IUserGroupChatsRepository UserGroupChatsRepository => new UserGroupChatsRepository(Context);
    public IMessagesRepository MessagesRepository => new MessagesRepository(Context);
    public IGroupChatsRepository GroupChatsRepository => new GroupChatsRepository(Context);
    public IGroupChatMessagesRepository GroupChatMessagesRepository => new GroupChatMessagesRepository(Context);

    public IGroupChatServerMessagesRepository GroupChatServerMessagesRepository =>
        new GroupChatServerMessagesRepository(Context);
}