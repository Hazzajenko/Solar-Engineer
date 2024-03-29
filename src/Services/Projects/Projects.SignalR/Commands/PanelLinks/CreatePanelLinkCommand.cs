﻿using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.PanelLinks;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.PanelLinks;

public record CreatePanelLinkCommand(AuthUser User, CreatePanelLinkRequest Request, string RequestId, string ProjectId)
    : ICommand<bool>,
        IProjectCommand<CreatePanelLinkRequest>
{
    public CreatePanelLinkCommand()
        : this(null!, null!, null!, null!)
    {
    }
}