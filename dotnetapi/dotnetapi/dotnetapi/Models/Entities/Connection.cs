namespace dotnetapi.Models.Entities;

public class Connection {
    public Connection() {
    }

    public Connection(string connectionId, string username) {
        ConnectionId = connectionId;
        Username = username;
    }

    private string ConnectionId { get; set; } = default!;
    private string Username { get; set; } = default!;
}