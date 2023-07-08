namespace ApplicationCore.Interfaces;

public interface IUser
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
}
