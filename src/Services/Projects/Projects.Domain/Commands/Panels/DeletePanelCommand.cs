﻿using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

public record DeletePanelCommand(
    AuthUser User,
    DeletePanelRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeletePanelRequest>
{
    public DeletePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}