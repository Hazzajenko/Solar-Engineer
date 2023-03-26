namespace Projects.Application;

/*[LocalQueue("Notifications")]
[RetryNow(typeof(HttpRequestException), 50, 100, 250)]
public class ReservationAddedHandler
{
    public async Task Handle(AppUserEvent added, IQuerySession session)
    {
        // add some interesting code here...
        Console.WriteLine($"Apparently a new reservation with ID=${added.Id} got added");
        // simulate some work
        await Task.Delay(200);
    }
}*/