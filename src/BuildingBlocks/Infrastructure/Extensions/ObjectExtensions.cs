namespace Infrastructure.Extensions;

public static class ObjectExtensions
{
    public static bool EqualsOneOf(this object objA, object objB, object objC)
    {
        return objA.Equals(objB) || objA.Equals(objC);
    }

    public static bool EqualsOneOf(this object objA, object objB, object objC, object objD)
    {
        return objA.Equals(objB) || objA.Equals(objC) || objA.Equals(objD);
    }

    public static bool EqualsOneOf(
        this object objA,
        object objB,
        object objC,
        object objD,
        object objE
    )
    {
        return objA.Equals(objB) || objA.Equals(objC) || objA.Equals(objD) || objA.Equals(objE);
    }

    /*public static bool EqualsOneOf(this string objA, string objB, string objC, string objD, string objE, string objF)
    {
        return objA.Equals(objB) || objA.Equals(objC) || objA.Equals(objD) || objA.Equals(objE) || objA.Equals(objF);
    }*/
}
