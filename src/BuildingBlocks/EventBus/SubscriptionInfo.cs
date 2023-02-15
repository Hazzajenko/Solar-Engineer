namespace EventBus;

public partial class InMemoryEventBusSubscriptionsManager : IEventBusSubscriptionsManager
{
    public class SubscriptionInfo
    {
        private SubscriptionInfo(bool isDynamic, Type handlerType)
        {
            IsDynamic = isDynamic;
            HandlerType = handlerType;
        }

        public bool IsDynamic { get; }
        public Type HandlerType { get; }

        public static SubscriptionInfo Dynamic(Type handlerType)
        {
            return new(true, handlerType);
        }

        public static SubscriptionInfo Typed(Type handlerType)
        {
            return new(false, handlerType);
        }
    }
}