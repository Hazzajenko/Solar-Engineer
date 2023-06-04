namespace Projects.Application.Consumers;

/*
public class UserUpdatedConsumer : IConsumer<UserUpdated>
{
    private readonly ILogger<UserUpdatedConsumer> _logger;
    private readonly IProjectsUnitOfWork _projectsUnitOfWork;
    private readonly IProjectUsersRepository _projectUsersRepository;

    public UserUpdatedConsumer(ILogger<UserUpdatedConsumer> logger,
        IProjectUsersRepository projectUsersRepository,
        IProjectsUnitOfWork projectsUnitOfWork)
    {
        _logger = logger;
        _projectUsersRepository = projectUsersRepository;
        _projectsUnitOfWork = projectsUnitOfWork;
    }

    public async Task Consume(ConsumeContext<UserUpdated> context)
    {
        _logger.LogInformation("UserUpdatedConsumer: {@User}",
            context.Message);

        var messageUser = new ProjectUser(context.Message.Id, context.Message.UserName, context.Message.DisplayName,
            context.Message.PhotoUrl);
        var user = await _projectUsersRepository.GetByIdAsync(context.Message.Id);
        if (user is null)
        {
            await _projectUsersRepository.AddAsync(messageUser);
        }
        else if (user.IsChanges(messageUser))
        {
            user.Update(context.Message.UserName, context.Message.DisplayName, context.Message.PhotoUrl);
            await _projectUsersRepository.UpdateAsync(user);
        }

        await _projectsUnitOfWork.SaveChangesAsync();
    }
}*/