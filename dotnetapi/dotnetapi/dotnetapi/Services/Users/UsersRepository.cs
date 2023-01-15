using dotnetapi.Data;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
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
            .Where(x => x.FriendRequestFlag == FriendRequestFlag.None)
            .Include(x => x.RequestedBy)
            .Include(x => x.RequestedTo)
            .ToListAsync();
    }

    public async Task<IEnumerable<AppUserFriend>> GetReceivedRequestsAsync(AppUser user)
    {
        return await _context.AppUserFriends
            .Where(x => x.RequestedToId == user.Id)
            .Where(x => x.FriendRequestFlag == FriendRequestFlag.None)
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

    public async Task<AppUserFriend?> GetAppUserFriendAsync(AppUser user, AppUser friend)
    {
        var app = await _context.AppUserFriends
            .Where(x => x.RequestedById == friend.Id)
            .Where(x => x.RequestedToId == user.Id)
            .SingleOrDefaultAsync();

        return app;
        /*await _context.AppUserFriends.AddAsync(request);
        await _context.SaveChangesAsync();
        
        return request;*/
    }

    public async Task<AppUserFriend> AcceptFriendRequestAsync(AppUserFriend request)
    {
        request.FriendRequestFlag = FriendRequestFlag.Approved;
        request.BecameFriendsTime = DateTime.Now;

        await _context.SaveChangesAsync();

        return request;
        /*await _context.AppUserFriends.AddAsync(request);
        await _context.SaveChangesAsync();
        
        return request;*/
    }

    public async Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user)
    {
        var friendsFromSent = await _context.AppUserFriends
            .Where(x => x.RequestedById == user.Id)
            .Where(x => x.FriendRequestFlag == FriendRequestFlag.Approved)
            .Include(x => x.RequestedTo)
            .Select(x => x.ToFriendDtoFromSent())
            .ToListAsync();


        var friendsFromReceived = await _context.AppUserFriends
            .Where(x => x.RequestedToId == user.Id)
            .Where(x => x.FriendRequestFlag == FriendRequestFlag.Approved)
            .Include(x => x.RequestedBy)
            .Select(x => x.ToFriendDtoFromReceived())
            .ToListAsync();

        friendsFromSent.AddRange(friendsFromReceived);
        return friendsFromSent;
    }
}