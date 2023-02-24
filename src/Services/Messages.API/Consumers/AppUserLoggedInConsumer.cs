﻿// using DotNetCore.EntityFrameworkCore;

// using DotNetCore.EntityFrameworkCore;

using EventBus.Domain.AppUserEvents;
using EventBus.Domain.AppUserEvents.Events;
using Infrastructure.Helpers;
using MassTransit;
using Messages.API.Data;
using Messages.API.Entities;

namespace Messages.API.Consumers;

public class AppUserLoggedInConsumer : IConsumer<AppUserLoggedInEvent>
{
    private readonly ILogger<AppUserLoggedInConsumer> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public AppUserLoggedInConsumer(ILogger<AppUserLoggedInConsumer> logger, IMessagesUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task Consume(ConsumeContext<AppUserLoggedInEvent> context)
    {
        _logger.LogInformation("Messages Service received AppUserLoggedInEvent User {User}", context.Message.User.Id);
        var user = context.Message.ToUser<User>();

        var domainUser = await _unitOfWork.UsersRepository.GetByIdAsync(user.Id);
        if (domainUser is null)
        {
            await _unitOfWork.UsersRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            _logger.LogInformation("User {User} Added to Messages Service ", user.Id);
            await Task.CompletedTask;
            return;
        }

        var isSame = Helpers.CompareObjects(user, domainUser);
        if (isSame is false)
        {
            await _unitOfWork.UsersRepository.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}