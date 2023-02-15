namespace Infrastructure.Entities;

public class Ticket
{
    public string UserName { get; set; } = default!;
    public DateTime BookedOn { get; set; }
    public string Boarding { get; set; } = default!;
    public string Destination { get; set; } = default!;
}