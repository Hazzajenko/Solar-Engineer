using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Services;

public interface IGroupChatsRepository
{
    Task<AppUserGroupChat> CreateGroupChatAsync(AppUserGroupChat appUserGroupChat);
    Task<AppUserGroupChat> InviteToGroupChatAsync(AppUserGroupChat appUserGroupChat);
    Task<AppUserGroupChat?> GetAppUserGroupChatAsync(AppUser appUser, int groupChatId);
    Task<IEnumerable<GroupChatMemberDto>> GetGroupChatMembersAsync(int groupChatId);
    Task<IEnumerable<GroupChatDto>?> GetGroupChatsAsync(AppUser appUser);
    Task<ManyGroupChatsDataResponse> GetManyGroupChatsDtoAsync(AppUser appUser);
}

public class GroupChatsRepository : IGroupChatsRepository
{
    private readonly DataContext _context;

    public GroupChatsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<AppUserGroupChat> CreateGroupChatAsync(AppUserGroupChat appUserGroupChat)
    {
        await _context.AppUserGroupChats.AddAsync(appUserGroupChat);
        await _context.SaveChangesAsync();
        return appUserGroupChat;
    }

    public async Task<AppUserGroupChat> InviteToGroupChatAsync(AppUserGroupChat appUserGroupChat)
    {
        await _context.AppUserGroupChats.AddAsync(appUserGroupChat);
        await _context.SaveChangesAsync();
        return appUserGroupChat;
    }

    public async Task<AppUserGroupChat?> GetAppUserGroupChatAsync(AppUser appUser, int groupChatId)
    {
        return await _context.AppUserGroupChats
            .Where(x => x.AppUser.Id == appUser.Id)
            .Where(x => x.GroupChatId == groupChatId)
            .Include(x => x.GroupChat)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<GroupChatMemberDto>> GetGroupChatMembersAsync(int groupChatId)
    {
        return await _context.GroupChats
            .Where(x => x.Id == groupChatId)
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .Select(x => x.AppUserGroupChats.Select(x => x.ToMemberDto()))
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<GroupChatDto>?> GetGroupChatsAsync(AppUser appUser)
    {
        /*var appUserGroupChats = await _context.AppUserGroupChats
            .Where(x => x.AppUserId == appUser.Id).ToListAsync();

        var appUserGroupChatIds = appUserGroupChats.Select(x => x.GroupChatId).ToList();

        var groupChatMembers = appUserGroupChats.Select(x => x.ToMemberDto()).ToList();

        var groupChats = await _context.GroupChats
            .Where(x => appUserGroupChatIds.Contains(x.Id))
            .Include(x => x.GroupChatMessages.Take(1))
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(y => y.AppUser)
            /*.Select(x => x.ToDto(
                await GetMemberDtos(x.Id)
                ))#1#
            .ToListAsync();

        foreach (var groupChat in groupChats)
            groupChat.AppUserGroupChats = await _context.AppUserGroupChats
                .Where(z => z.GroupChatId == groupChat.Id)
                .Include(x => x.AppUser)
                .ToListAsync();

        var ss = await _context.AppUserGroupChats
            .Where(z => z.GroupChatId == 1)
            .Include(x => x.AppUser)
            .Select(x => x.ToMemberDto())
            .SingleOrDefaultAsync();

        var sdsa = groupChats.Select(async x =>
        {
            return new GroupChatDto
            {
                Id = x.Id,
                Name = x.Name,
                Members = await _context.AppUserGroupChats
                    .Where(z => z.GroupChatId == x.Id)
                    .Include(x => x.AppUser)
                    .Select(x => x.ToMemberDto())
                    .ToListAsync()
            };
        }).ToList();*/

        // sdsa.

        /*var appUserGroupChats = await _context.AppUserGroupChats
            .Where(x => x.AppUserId == appUser.Id).ToListAsync();

        var appUserGroupChatIds = appUserGroupChats.Select(x => x.GroupChatId).ToList();

        var groupChatMembers = appUserGroupChats.Select(x => x.ToMemberDto()).Take(5).ToList();*/


        return await _context.Users
            .Where(x => x.Id == appUser.Id)
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.GroupChat)
            .Select(y => y.AppUserGroupChats
                // .Select(x => x.GroupChat.ToDto(y.AppUserGroupChats.Select(u => u.ToMemberDto())))
                .Select(x =>
                    /*var dsad = y.AppUserGroupChats
                        .Where(y => y.GroupChatId == x.GroupChatId)
                        .Select(e => e.ToMemberDto());*/
                    new GroupChatDto
                    {
                        Id = x.GroupChat.Id,
                        Name = x.GroupChat.Name,
                        Members = y.AppUserGroupChats
                            .Where(y => y.GroupChatId == x.GroupChatId)
                            .Select(e => e.ToMemberDto())
                    }
                )
            )
            .SingleOrDefaultAsync();
    }

    public async Task<ManyGroupChatsDataResponse> GetManyGroupChatsDtoAsync(AppUser appUser)
    {
        var init = await _context.AppUserGroupChats
            .Where(x => x.AppUserId == appUser.Id)
            .Include(x => x.GroupChat)
            // .Select(x => x.ToDtoWithoutMembers())
            .ToListAsync();

        var appUserGroupChatIds = init.Select(x => x.GroupChatId).ToList();

        var appUserGroupChats = await _context.AppUserGroupChats
            .Where(x => x.AppUserId == appUser.Id)
            .Include(x => x.GroupChat)
            .Select(x => x.ToDtoWithoutMembers())
            .ToListAsync();

        var groupChatMembers = await _context.AppUserGroupChats
            .Where(x => appUserGroupChatIds.Contains(x.GroupChatId))
            .Include(x => x.AppUser)
            .Select(x => x.ToMemberDto())
            // .Take(1)
            .ToListAsync();

        // var groupChatMembersResult = new List<GroupChatMemberDto>();
        var groupChatMessagesResult = new List<GroupChatMessageDto>();
        foreach (var appUserGroupChatId in appUserGroupChatIds)
        {
            var groupChatMessage = await _context.GroupChatMessages
                .Where(x => x.GroupChatId == appUserGroupChatId)
                .Include(x => x.Sender)
                .Include(x => x.MessageReadTimes)
                .OrderBy(x => x.MessageSentTime)
                .Select(x => x.ToDto())
                .Take(1)
                .SingleOrDefaultAsync();
            if (groupChatMessage is null) continue;
            groupChatMessagesResult.Add(groupChatMessage);
        }

        var result = new ManyGroupChatsDataResponse
        {
            GroupChats = appUserGroupChats,
            GroupChatMembers = groupChatMembers,
            GroupChatMessages = new List<LastGroupChatMessageDto>()
        };

        return result;
    }

    private async Task<IEnumerable<GroupChatMemberDto>> GetMemberDtos(int id)
    {
        return await _context.AppUserGroupChats.Where(z => z.GroupChatId == id).Select(x => x.ToMemberDto())
            .ToListAsync();
    }
}