using ApplicationCore.Interfaces;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;

namespace Infrastructure.OpenTelemetry;

public static class TelemetryClientExtensions
{
    public static RequestTelemetry GetRequestTelemetry(
        this TelemetryClient telemetryClient,
        IUser user,
        Dictionary<string, string>? properties = null
    )
    {
        var requestTelemetry = new RequestTelemetry();
        requestTelemetry.Context.User.Id = user.Id.ToString();
        requestTelemetry.Properties.Add("UserId", user.Id.ToString());
        requestTelemetry.Properties.Add("UserName", user.UserName);
        if (properties is null)
            return requestTelemetry;
        foreach (var (key, value) in properties)
        {
            if (key is "UserId" or "UserName")
            {
                continue;
            }
            requestTelemetry.Properties.Add(key, value);
        }
        return requestTelemetry;
    }

    public static void TrackEventScopedAsUser(
        this TelemetryClient telemetryClient,
        string eventName,
        IUser user,
        Dictionary<string, string>? properties = null
    )
    {
        RequestTelemetry requestTelemetry = telemetryClient.GetRequestTelemetry(user);

        var eventDictionary = new Dictionary<string, string>
        {
            ["UserId"] = user.Id.ToString(),
            ["UserName"] = user.UserName
        };

        if (properties != null)
        {
            foreach (var (key, value) in properties)
            {
                requestTelemetry.Properties.Add(key, value);
                eventDictionary.Add(key, value);
            }
        }

        using var operation = telemetryClient.StartOperation(requestTelemetry);
        telemetryClient.TrackEvent(eventName, eventDictionary);
    }
}
