// using DotNetCore.EntityFrameworkCore;

using EventBus.Domain.AppUserEvents;
using EventBus.Domain.AppUserEvents.Events;
using Infrastructure.Helpers;
using MassTransit;
using Users.API.Data;
using Users.API.Entities;

namespace Users.API.Events;

public class CreatedAppUserConsumer : IConsumer<AppUserCreatedEvent>
{
    private readonly ILogger<CreatedAppUserConsumer> _logger;

    // private readonly IUsersContext _usersContext;
    private readonly IUnitOfWork _unitOfWork;

    // private readonly IUsersRepository _usersRepository;

    public CreatedAppUserConsumer(ILogger<CreatedAppUserConsumer> logger, IUnitOfWork unitOfWork)
    {
        _logger = logger;
        // _usersRepository = usersRepository;
        // _usersContext = usersContext;
        _unitOfWork = unitOfWork;
    }

    public async Task Consume(ConsumeContext<AppUserCreatedEvent> context)
    {
        var appUserCreatedEvent = context.Message;
        _logger.LogInformation("User {@User}", appUserCreatedEvent);
        var user = context.Message.ToUser<User>();
        // var user = context.Message.ToEntity();
        // var id = Guid.Parse(appUserCreatedEvent.AppUser.Id);
        var domainUser = await _unitOfWork.UsersRepository.GetByIdAsync(user.Id);
        if (domainUser is null)
        {
            // await _usersRepository.AddAsync(user);
            // await _unitOfWork.UsersRepository.AddAsync(user);
            await _unitOfWork.Complete();
            _logger.LogInformation("User {User} Added to Users Service ", user.Id);
            await Task.CompletedTask;
            return;
        }

        var isSame = Helpers.CompareObjects(user, domainUser);
        if (isSame is false)
        {
            await _unitOfWork.UsersRepository.UpdateAsync(user);
            await _unitOfWork.Complete();
        }
        // var comparer = new Comparer<User>();
        
        
        /*
        var properties = domainUser.GetType().GetProperties();
        foreach (var property in properties)
        {
            /*if (domainUser["dsad"])
            {
                
            }
            await _unitOfWork.UsersRepository.UpdatePartialAsync()#1#
            // property.
            _logger.LogInformation("Name {Name}", property.Name);
            _logger.LogInformation("PropertyType {PropertyType}", property.PropertyType);
            // Console.WriteLine(property.PropertyType);
            // Console.WriteLine(property.Name);
            /*Console.WriteLine(property.Name);
            properties.;
            property.SetValue(domainUser, value);#1#
        }*/

        await Task.CompletedTask;
    }
}