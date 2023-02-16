using Users.API.Entities;

namespace Users.API.Events;

public class CompareFunc : Comparer<User>
{
    public override int Compare(User? x, User? y)
    {
        throw new NotImplementedException();
    }
}