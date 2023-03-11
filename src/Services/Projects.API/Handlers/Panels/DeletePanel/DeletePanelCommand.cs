﻿using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.DeletePanel;

public record DeletePanelCommand(HubAppUser User, DeletePanelRequest Request, string RequestId, string ProjectId)
    : ICommand<bool>,
        IProjectCommand<DeletePanelRequest>
{
    public DeletePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}