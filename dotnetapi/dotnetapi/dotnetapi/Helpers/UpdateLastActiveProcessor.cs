using dotnetapi.Contracts.Requests.Auth;
using dotnetapi.Data;
using dotnetapi.Extensions;
using FastEndpoints;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Helpers;

public class UpdateLastActiveProcessor : IGlobalPreProcessor
{
    public async Task PreProcessAsync(object req, HttpContext ctx, List<ValidationFailure> failures, CancellationToken ct)
    {

        if (req is AuthRequest _) return;
        if (req is ValidateUserRequest _) return;
      

        var db = ctx.Resolve<DataContext>();
        var userName = ctx.User.GetUsername();
        var user = await db.Users.FirstOrDefaultAsync(x => x.UserName == userName, ct);
        if (user is null) return;
        user.LastActive = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }
}