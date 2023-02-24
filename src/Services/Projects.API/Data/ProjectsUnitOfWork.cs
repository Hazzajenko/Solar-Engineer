using Infrastructure.Data;
using Projects.API.Repositories.AppUserProjects;
using Projects.API.Repositories.Projects;

namespace Projects.API.Data;

public class ProjectsUnitOfWork : UnitOfWorkFactory<ProjectsContext>, IProjectsUnitOfWork
{
    public ProjectsUnitOfWork(ProjectsContext context) : base(context)
    {
    }

    public IProjectsRepository ProjectsRepository => new ProjectsRepository(Context);

    public IAppUserProjectsRepository AppUserProjectsRepository => new AppUserProjectsRepository(Context);
    /*public IUsersRepository UsersRepository => new UsersRepository(Context);
    public IUserGroupChatsRepository UserGroupChatsRepository => new UserGroupChatsRepository(Context);
    public IMessagesRepository MessagesRepository => new MessagesRepository(Context);
    public IGroupChatsRepository GroupChatsRepository => new GroupChatsRepository(Context);
    public IGroupChatMessagesRepository GroupChatMessagesRepository => new GroupChatMessagesRepository(Context);

    public IGroupChatServerMessagesRepository GroupChatServerMessagesRepository =>
        new GroupChatServerMessagesRepository(Context);*/
}