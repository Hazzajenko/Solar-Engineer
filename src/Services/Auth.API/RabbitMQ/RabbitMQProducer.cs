using System.Text;
using Newtonsoft.Json;
using RabbitMQ.Client;

namespace Auth.API.RabbitMQ;

public class RabbitMqProducer : IMessageProducer
{
    public void SendMessage<T>(T message)
    {
        var factory = new ConnectionFactory
        {
            HostName = "localhost"
        };

        var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare("orders", exclusive: false);

        var json = JsonConvert.SerializeObject(message);
        var body = Encoding.UTF8.GetBytes(json);

        channel.BasicPublish("", "orders", body: body);
    }
}