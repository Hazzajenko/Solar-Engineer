namespace Auth.API.RabbitMQ;

public interface IMessageProducer
{
    void SendMessage<T>(T message);
}