using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Groups.Services;

public interface IGroupsRepository
{
    Task<Group> AddGroupAsync(Group group);
    Task<Group?> GetGroupFromConnectionAsync(string connectionId);
    Task<Group?> GetMessageGroupAsync(string groupName);
}

public class GroupsRepository : IGroupsRepository
{
    private readonly DataContext _context;

    public GroupsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Group> AddGroupAsync(Group group)
    {
        await _context.Groups.AddAsync(group);
        await _context.SaveChangesAsync();
        return group;
    }

    public async Task<Group?> GetGroupFromConnectionAsync(string connectionId)
    {
        return await _context.Groups
            .Include(c => c.Connections)
            .Where(c => c.Connections.Any(x => x.ConnectionId == connectionId))
            .FirstOrDefaultAsync();
    }

    public async Task<Group?> GetMessageGroupAsync(string groupName)
    {
        return await _context.Groups
            .Include(x => x.Connections)
            .FirstOrDefaultAsync(x => x.Name == groupName);
    }
}