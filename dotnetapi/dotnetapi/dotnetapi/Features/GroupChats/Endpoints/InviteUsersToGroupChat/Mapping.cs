using System.Text;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.GroupChats.Endpoints.InviteUsersToGroupChat;

public static class Mapping
{
    public static GroupChatServerMessage ToServerMessage(
        this IEnumerable<AppUserGroupChat> request,
        AppUser appUser
    )
    {
        return new GroupChatServerMessage
        {
            GroupChat = request.First().GroupChat,
            Content = PrintMembers(request, appUser),
            MessageSentTime = DateTime.UtcNow
        };

        static string PrintMembers(IEnumerable<AppUserGroupChat> appUserGroupChats, AppUser appUser)
        {
            var userNames = appUserGroupChats.Select(x => x.AppUser.UserName!);
            var sb = new StringBuilder();

            sb.Append($"{appUser} invited ");
            foreach (var userName in userNames)
            {
                sb.Append(userName);
                if (userName != userNames.Last())
                    sb.Append(", ");
            }

            sb.Append($" to {appUserGroupChats.First().GroupChat.Name}");

            return sb.ToString();
        }
    }
}