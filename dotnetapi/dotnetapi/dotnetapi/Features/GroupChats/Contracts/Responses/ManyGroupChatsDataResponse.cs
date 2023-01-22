using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class ManyGroupChatsDataResponse
{
    public ManyGroupChatsDto GroupChats { get; set; } = default!;
}