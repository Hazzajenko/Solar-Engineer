using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Services.Users;

public class UsersRepository : IUsersRepository
{
    private readonly DataContext _context;
    private readonly UserManager<AppUser> _userManager;

    public UsersRepository(DataContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<IEnumerable<AppUserFriend>> GetSentRequestsAsync(AppUser user)
    {
        return await _context.AppUserFriends
            .Where(x => x.RequestedById == user.Id)
            .Include(x => x.RequestedBy)
            .Include(x => x.RequestedTo)
            .ToListAsync();
    }

    public async Task<IEnumerable<AppUserFriend>> GetReceivedRequestsAsync(AppUser user)
    {
        return await _context.AppUserFriends
            .Where(x => x.RequestedToId == user.Id)
            .Include(x => x.RequestedBy)
            .Include(x => x.RequestedTo)
            .ToListAsync();
    }


    public async Task<AppUserFriend> AddFriendAsync(AppUserFriend request)
    {
        await _context.AppUserFriends.AddAsync(request);
        await _context.SaveChangesAsync();
        
        return request;
    }
}