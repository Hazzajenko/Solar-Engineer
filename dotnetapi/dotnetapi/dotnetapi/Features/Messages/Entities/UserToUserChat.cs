using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Messages.Entities;

public class UserToUserChat : BaseEntity
{
    public int AppUserOneId { get; set; }
    public AppUser AppUserOne { get; set; } = default!;
    public int AppUserTwoId { get; set; }
    public AppUser AppUserTwo { get; set; } = default!;
    public ICollection<Message> Messages { get; set; } = default!;
}