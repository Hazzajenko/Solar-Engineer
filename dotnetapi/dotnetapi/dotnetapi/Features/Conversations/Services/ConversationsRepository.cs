using dotnetapi.Data;
using dotnetapi.Features.Conversations.Entities;
using dotnetapi.Features.Conversations.Mapping;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Conversations.Services;

public interface IConversationsRepository
{
    Task<Conversation> CreateConversationAsync(AppUserConversation appUserConversation);
    Task<AppUserConversation> InviteToConversationAsync(AppUserConversation appUserConversation);
    Task<AppUserConversation?> GetAppUserConversationAsync(AppUser appUser, int conversationId);
    Task<IEnumerable<ConversationMemberDto>> GetConversationMembersAsync(AppUser appUser, int conversationId);
}

public class ConversationsRepository : IConversationsRepository
{
    private readonly DataContext _context;

    public ConversationsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Conversation> CreateConversationAsync(AppUserConversation appUserConversation)
    {
        await _context.AppUserConversations.AddAsync(appUserConversation);
        await _context.SaveChangesAsync();
        return appUserConversation.Conversation;
    }

    public async Task<AppUserConversation> InviteToConversationAsync(AppUserConversation appUserConversation)
    {
        await _context.AppUserConversations.AddAsync(appUserConversation);
        await _context.SaveChangesAsync();
        return appUserConversation;
    }

    public async Task<AppUserConversation?> GetAppUserConversationAsync(AppUser appUser, int conversationId)
    {
        return await _context.AppUserConversations
            .Where(x => x.AppUser.Id == appUser.Id)
            .Where(x => x.ConversationId == conversationId)
            .Include(x => x.Conversation)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<ConversationMemberDto>> GetConversationMembersAsync(AppUser appUser,
        int conversationId)
    {
        return await _context.Conversations
            .Where(x => x.Id == conversationId)
            .Include(x => x.AppUserConversations)
            .ThenInclude(x => x.AppUser)
            .Select(x => x.AppUserConversations.Select(x => x.ToMemberDto()))
            .SingleOrDefaultAsync();
    }
}