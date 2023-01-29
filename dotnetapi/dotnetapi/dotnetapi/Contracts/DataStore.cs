namespace dotnetapi.Contracts;

public class DataStore<T>
{
    public DataStore(T data)
    {
        Data = data;
    }

    private T Data { get; }
}