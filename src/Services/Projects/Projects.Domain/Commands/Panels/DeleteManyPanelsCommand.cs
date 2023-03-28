﻿using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

public record DeleteManyPanelsCommand(
    AuthUser User,
    DeleteManyPanelsRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeleteManyPanelsRequest>
{
    public DeleteManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}