using System.ComponentModel.DataAnnotations;
using dotnetapi.Models.SignalR;

namespace dotnetapi.Models.Entities;

public class Group
{
    public Group(string name)
    {
        Name = name;
    }

    [Key] public string Name { get; set; }

    public ICollection<Connection> Connections { get; set; } = new List<Connection>();
}