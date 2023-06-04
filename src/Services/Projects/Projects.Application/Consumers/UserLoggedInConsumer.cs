namespace Projects.Application.Consumers;

/*
public class UserLoggedInConsumer : IConsumer<UserLoggedIn>
{
    private readonly IRequestClient<UserLoggedInResponse> _client;
    private readonly ILogger<UserLoggedInConsumer> _logger;

    private readonly IProjectsUnitOfWork _projectsUnitOfWork;
    // private readonly IProjectUsersRepository _projectUsersRepository;

    public UserLoggedInConsumer(ILogger<UserLoggedInConsumer> logger,
        IProjectsUnitOfWork projectsUnitOfWork, IRequestClient<UserLoggedInResponse> client)
    {
        _logger = logger;
        // _projectUsersRepository = projectUsersRepository;
        _projectsUnitOfWork = projectsUnitOfWork;
        _client = client;
    }

    public async Task Consume(ConsumeContext<UserLoggedIn> context)
    {
        _logger.LogInformation("UserLoggedInConsumer: {@User}",
            context.Message);
        context.Message.DumpObjectJson();
        var appUserId = context.Message.Id;
        /*var projectUser =
            await _client.GetResponse<UserFound, UserNotFound>(new CreateProjectEvent(command.User.Id), cT);
        if (projectUser.Is(out Response<UserNotFound>? userNotFoundResponse))
        {
            var userNotFound = userNotFoundResponse!.Message;
            _logger.LogError("User {User} not found", userNotFound.Id);
            throw new Exception($"User {appUserId} not found");
        }

        if (projectUser.Is(out Response<UserFound>? userFoundResponse))
        {
            var userFound = userFoundResponse!.Message;
            _logger.LogInformation("User {User} found", userFound.Id);
        }#1#

        // ArgumentNullException.ThrowIfNull(userFoundResponse?.Message);
        /*var messageUser = new ProjectUser(context.Message.Id, context.Message.UserName, context.Message.DisplayName,
            context.Message.PhotoUrl);#1#
        /*var user = await _projectUsersRepository.GetByIdAsync(context.Message.Id);
        if (user is null)
        {
            await _projectUsersRepository.AddAsync(messageUser);
        }
        else if (user.IsChanges(messageUser))
        {
            user.Update(context.Message.UserName, context.Message.DisplayName, context.Message.PhotoUrl);
            await _projectUsersRepository.UpdateAsync(user);
        }#1#

        var toSend = new UserLoggedInResponse(context.Message.Id, context.Message.UserName,
            context.Message.DisplayName, context.Message.PhotoUrl);
        var response = await _client.GetResponse<UserFound, UserNotFound>(toSend);
        response.DumpObjectJson();
        // var response = await _client.GetResponse<UserLoggedInResponse>(context.Message);
        _logger.LogInformation("UserLoggedInConsumer Response: {@User}", response.Message);

        // await _projectsUnitOfWork.SaveChangesAsync();
    }
}*/