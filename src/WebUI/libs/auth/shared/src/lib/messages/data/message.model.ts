import { GroupChatReadTimeModel } from './group-chat-read-time.model'
import { MessageFrom } from './message-from.model'

export interface MessageModel {
	id: string
	senderId: string
	recipientId: string
	content: string
	messageReadTime: string | null
	messageSentTime: string
	messageReadTimes: GroupChatReadTimeModel[]
	messageFrom: MessageFrom
	isUserSender: boolean
	otherUserId: string
}
