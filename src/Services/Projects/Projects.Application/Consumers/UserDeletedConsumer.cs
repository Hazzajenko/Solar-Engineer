namespace Projects.Application.Consumers;

/*
public class UserDeletedConsumer : IConsumer<UserDeleted>
{
    private readonly ILogger<UserDeletedConsumer> _logger;
    private readonly IProjectsUnitOfWork _projectsUnitOfWork;
    private readonly IProjectUsersRepository _projectUsersRepository;

    public UserDeletedConsumer(ILogger<UserDeletedConsumer> logger,
        IProjectUsersRepository projectUsersRepository,
        IProjectsUnitOfWork projectsUnitOfWork)
    {
        _logger = logger;
        _projectUsersRepository = projectUsersRepository;
        _projectsUnitOfWork = projectsUnitOfWork;
    }

    public async Task Consume(ConsumeContext<UserDeleted> context)
    {
        _logger.LogInformation("UserDeletedConsumer: {@User}",
            context.Message);

        var user = await _projectUsersRepository.GetByIdAsync(context.Message.Id);
        if (user is null)
        {
            _logger.LogError("UserDeletedConsumer: User with id {Id} not found, {@User}", context.Message.Id,
                context.Message);
            return;
        }

        await _projectUsersRepository.DeleteAsync(user);
        await _projectsUnitOfWork.SaveChangesAsync();
    }
}*/