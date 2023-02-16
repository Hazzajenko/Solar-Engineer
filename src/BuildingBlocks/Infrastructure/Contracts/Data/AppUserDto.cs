namespace Infrastructure.Contracts.Data;

public class AppUserDto /* : IMapFrom<AppUser>*/
{
    public string Id { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastActiveTime { get; set; } = DateTime.Now;

    /*
    public void Mapping(Profile profile)
    {
        profile.CreateMap<AppUser, AppUserDto>();
    }*/
}