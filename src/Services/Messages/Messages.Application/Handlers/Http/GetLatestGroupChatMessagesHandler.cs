using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Data;

namespace Messages.Application.Handlers.Http;

public sealed record GetLatestGroupChatMessagesQuery(ClaimsPrincipal User)
    : IRequest<IEnumerable<GroupChatDto>>;

public class GetLatestGroupChatMessagesHandler
    : IRequestHandler<GetLatestGroupChatMessagesQuery, IEnumerable<GroupChatDto>>
{
    private readonly IMessagesUnitOfWork _unitOfWork;

    public GetLatestGroupChatMessagesHandler(IMessagesUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<IEnumerable<GroupChatDto>> Handle(
        GetLatestGroupChatMessagesQuery request,
        CancellationToken cT
    )
    {
        return await _unitOfWork.AppUserGroupChatsRepository.GetLatestGroupChatMessagesAsync(
            request.User.GetGuidUserId()
        );
    }
}
