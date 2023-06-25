/*
using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Messages.Contracts.Data;

namespace Messages.Application.Converters;

public class MessagePreviewDtoConverter : JsonConverter<MessagePreviewDto>
{
    public override MessagePreviewDto Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options
    )
    {
        // Implement your custom deserialization logic here
        throw new NotImplementedException();
    }

    public override void Write(
        Utf8JsonWriter writer,
        MessagePreviewDto value,
        JsonSerializerOptions options
    )
    {
        writer.WriteStartObject();

        writer.WriteString("id", value.Id);
        writer.WriteBoolean("isGroup", value.IsGroup);
        writer.WriteString("lastMessageContent", value.LastMessageContent);
        writer.WriteString("lastMessageSenderId", value.LastMessageSenderId);
        writer.WriteString("lastMessageFrom", value.LastMessageFrom);
        writer.WriteString(
            "lastMessageSentTime",
            value.LastMessageSentTime.ToString(CultureInfo.CurrentCulture)
        );
        writer.WriteBoolean("isLastMessageReadByUser", value.IsLastMessageReadByUser);
        writer.WriteBoolean("isLastMessageUserSender", value.IsLastMessageUserSender);

        if (value is GroupChatMessagePreviewDto groupChatModel)
        {
            writer.WriteString("groupChatName", groupChatModel.GroupChatName);
            writer.WriteString("groupChatPhotoUrl", groupChatModel.GroupChatPhotoUrl);
        }
        else if (value is UserMessagePreviewDto userMessageModel)
        {
            writer.WriteString("otherUserId", userMessageModel.OtherUserId);
        }

        writer.WriteEndObject();
    }
}
*/
