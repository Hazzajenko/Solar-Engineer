import { GroupChatReadTimeDto } from './group-chat-read-time-dto.model'
import { MessageFrom } from './message-from.model'

export interface GroupChatCombinedMessageDto {
	id: string
	groupChatId: string
	senderId: string
	content: string
	messageReadTimes: GroupChatReadTimeDto[]
	messageSentTime: string
	messageFrom: MessageFrom
	senderInGroup: boolean
	serverMessage: boolean
}
