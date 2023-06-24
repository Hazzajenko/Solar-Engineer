using ApplicationCore.Entities;
using Identity.Contracts.Data;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Connections;

public record SendDeviceInfoCommand(AuthUser AuthUser, DeviceInfoDto DeviceInfoDto)
    : ICommand<bool>;
