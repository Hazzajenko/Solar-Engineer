using dotnetapi.Data;
using dotnetapi.Features.Images.Entities;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record UpdateDisplayPictureQuery(AppUser AppUser, S3ImageDto S3ImageDto) : IRequest<bool>;

public class UpdateDisplayPictureHandler : IRequestHandler<UpdateDisplayPictureQuery, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;

    public UpdateDisplayPictureHandler(
        IDataContext context,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateDisplayPictureQuery request, CancellationToken cT)
    {
        var appUser = await _context.Users.SingleOrDefaultAsync(
            x => x.UserName == request.AppUser.UserName,
            cT
        );
        if (appUser is null) return false;
        appUser.PhotoUrl = request.S3ImageDto.ImageName;
        return await _context.SaveChangesAsync(cT) > 0;
    }
}