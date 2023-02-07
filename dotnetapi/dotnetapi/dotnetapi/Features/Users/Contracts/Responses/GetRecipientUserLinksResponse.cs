using dotnetapi.Features.Users.Data;

namespace dotnetapi.Features.Users.Contracts.Responses;

public class GetRecipientUserLinksResponse
{
    public IEnumerable<RecipientUserFriendDto> RecipientUserFriends { get; set; } = default!;
}