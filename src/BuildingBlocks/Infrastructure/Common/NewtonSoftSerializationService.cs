using System.Text.Json;

namespace Infrastructure.Common;

public class NewtonSoftSerializationService : ISerializationService
{
    public T? Deserialize<T>(string text)
    {
        return JsonSerializer.Deserialize<T>(text);
        // return JsonConvert.DeserializeObject<T>(text);
    }

    public string Serialize<T>(T obj)
    {
        return JsonSerializer.Serialize(obj /*, new JsonSerializerOptions
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore,
            /*Converters = new List<JsonConverter>
            {
                new StringEnumConverter() {  NamingStrategy = new CamelCaseNamingStrategy() }
            }#1#
        }*/);
        /*return JsonConvert.SerializeObject(obj, new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            NullValueHandling = NullValueHandling.Ignore,
            Converters = new List<JsonConverter>
            {
                new StringEnumConverter() {NamingStrategy =  new CamelCaseNamingStrategy()}
            }
        });*/
    }

    public string Serialize<T>(T obj, Type type)
    {
        return JsonSerializer.Serialize(obj, type);
        // return JsonConvert.SerializeObject(obj, type, new());
    }
}