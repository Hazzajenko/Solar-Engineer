using Infrastructure.Data;
using Messages.Application.Repositories.GroupChatMessages;
using Messages.Application.Repositories.GroupChats;
using Messages.Application.Repositories.GroupChatServerMessages;
using Messages.Application.Repositories.Messages;
using Messages.Application.Repositories.UserGroupChats;

namespace Messages.Application.Data.UnitOfWork;

public class MessagesUnitOfWork : UnitOfWorkFactory<MessagesContext>, IMessagesUnitOfWork
{
    public MessagesUnitOfWork(MessagesContext context) : base(context)
    {
    }
    public IAppUserGroupChatsRepository AppUserGroupChatsRepository => new AppAppUserGroupChatsRepository(Context);
    public IMessagesRepository MessagesRepository => new MessagesRepository(Context);
    public IGroupChatsRepository GroupChatsRepository => new GroupChatsRepository(Context);
    public IGroupChatMessagesRepository GroupChatMessagesRepository => new GroupChatMessagesRepository(Context);

    public IGroupChatServerMessagesRepository GroupChatServerMessagesRepository =>
        new GroupChatServerMessagesRepository(Context);
}