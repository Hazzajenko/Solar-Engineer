namespace Infrastructure.Mapping;

public static class ListMapper
{
    public static IEnumerable<TObject> ToIEnumerable<TObject>(this TObject obj)
        where TObject : class
    {
        return new List<TObject> { obj };
    }
}