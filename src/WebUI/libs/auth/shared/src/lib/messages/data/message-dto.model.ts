import { GroupChatReadTimeDto } from './group-chat-read-time-dto.model'
import { MessageFrom } from './message-from.model'

export interface MessageDto {
	id: string
	senderId: string
	recipientId: string
	content: string
	messageReadTime: string | null
	messageSentTime: string
	messageReadTimes: GroupChatReadTimeDto[]
	messageFrom: MessageFrom
	isUserSender: boolean
}
