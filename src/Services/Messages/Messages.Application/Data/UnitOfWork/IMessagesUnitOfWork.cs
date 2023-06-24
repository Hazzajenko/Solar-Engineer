using Infrastructure.Data;
using Messages.Application.Repositories.AppUserGroupChats;
using Messages.Application.Repositories.GroupChatMessages;
using Messages.Application.Repositories.GroupChats;
using Messages.Application.Repositories.GroupChatServerMessages;
using Messages.Application.Repositories.Messages;

namespace Messages.Application.Data.UnitOfWork;

public interface IMessagesUnitOfWork : IUnitOfWorkFactory
{
    IAppUserGroupChatsRepository AppUserGroupChatsRepository { get; }
    IMessagesRepository MessagesRepository { get; }
    IGroupChatsRepository GroupChatsRepository { get; }
    IGroupChatMessagesRepository GroupChatMessagesRepository { get; }
    // IGroupChatServerMessagesRepository GroupChatServerMessagesRepository { get; }
}
