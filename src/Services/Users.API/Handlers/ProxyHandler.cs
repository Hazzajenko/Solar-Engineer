using Mediator;
using Users.API.Data;

namespace Users.API.Handlers;

public sealed record ProxyCommand : ICommand<string>;

public class ProxyHandler : ICommandHandler<ProxyCommand, string>
{
    private readonly ILogger<ProxyHandler> _logger;
    private readonly IUsersUnitOfWork _unitOfWork;

    public ProxyHandler(ILogger<ProxyHandler> logger, IUsersUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public ValueTask<string> Handle(ProxyCommand request, CancellationToken cT)
    {
        return new ValueTask<string>("proxy works");
    }
}