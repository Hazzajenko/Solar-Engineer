namespace Projects.Application.Consumers;

/*
public class UserRegisteredConsumer : IConsumer<UserRegistered>
{
    private readonly ILogger<UserRegisteredConsumer> _logger;
    private readonly IProjectsUnitOfWork _projectsUnitOfWork;
    private readonly IProjectUsersRepository _projectUsersRepository;

    public UserRegisteredConsumer(ILogger<UserRegisteredConsumer> logger,
        IProjectUsersRepository projectUsersRepository,
        IProjectsUnitOfWork projectsUnitOfWork)
    {
        _logger = logger;
        _projectUsersRepository = projectUsersRepository;
        _projectsUnitOfWork = projectsUnitOfWork;
    }

    public async Task Consume(ConsumeContext<UserRegistered> context)
    {
        _logger.LogInformation("UserRegisteredConsumer: {@User}",
            context.Message);

        var messageUser = new ProjectUser(context.Message.Id, context.Message.UserName, context.Message.DisplayName,
            context.Message.PhotoUrl);
        await _projectUsersRepository.AddAsync(messageUser);

        await _projectsUnitOfWork.SaveChangesAsync();
    }
}*/