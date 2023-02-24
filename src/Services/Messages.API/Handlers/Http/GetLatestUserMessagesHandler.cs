using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Messages.API.Contracts.Data;
using Messages.API.Data;

namespace Messages.API.Handlers.Http;

public sealed record GetLatestUserMessagesQuery(ClaimsPrincipal User) : IRequest<IEnumerable<LatestUserMessageDto>>;

public class
    GetLatestUserMessagesHandler : IRequestHandler<GetLatestUserMessagesQuery, IEnumerable<LatestUserMessageDto>>
{
    private readonly IMessagesUnitOfWork _unitOfWork;

    public GetLatestUserMessagesHandler(IMessagesUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<IEnumerable<LatestUserMessageDto>>
        Handle(GetLatestUserMessagesQuery request, CancellationToken cT)
    {
        return await _unitOfWork.MessagesRepository.GetLatestUserMessagesAsync(request.User.GetGuidUserId());
    }
}