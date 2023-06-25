using Infrastructure.Repositories;
using Messages.Contracts.Data;
using Messages.Domain.Entities;

namespace Messages.Application.Repositories.Messages;

public interface IMessagesRepository : IGenericRepository<Message>
{
    Task<IEnumerable<MessageDto>> GetUserMessagesWithUserAsync(
        Guid appUserId,
        Guid recipientUserId
    );
    Task<IEnumerable<LatestUserMessageDto>> GetLatestUserMessagesAsync(Guid appUserId);

    Task<IEnumerable<MessagePreviewDto>> GetLatestUserMessagesAsPreviewAsync(Guid appUserId);
}
