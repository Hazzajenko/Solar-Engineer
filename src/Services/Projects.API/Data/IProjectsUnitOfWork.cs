using Infrastructure.Data;
using Projects.API.Repositories.AppUserProjects;
using Projects.API.Repositories.Projects;

namespace Projects.API.Data;

public interface IProjectsUnitOfWork : IUnitOfWorkFactory
{
    IProjectsRepository ProjectsRepository { get; }

    IAppUserProjectsRepository AppUserProjectsRepository { get; }
    // IProjectsRepository ProjectsRepository { get; }
    /*IUsersRepository UsersRepository { get; }
    IUserGroupChatsRepository UserGroupChatsRepository { get; }
    IMessagesRepository MessagesRepository { get; }
    IGroupChatsRepository GroupChatsRepository { get; }
    IGroupChatMessagesRepository GroupChatMessagesRepository { get; }
    IGroupChatServerMessagesRepository GroupChatServerMessagesRepository { get; }*/
}