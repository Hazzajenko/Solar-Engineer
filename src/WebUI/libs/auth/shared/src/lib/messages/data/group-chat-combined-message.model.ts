import { GroupChatReadTimeModel } from './group-chat-read-time.model'
import { MessageFrom } from './message-from.model'

export interface GroupChatCombinedMessageModel {
	id: string
	groupChatId: string
	senderId: string
	content: string
	messageReadTimes: GroupChatReadTimeModel[]
	messageSentTime: string
	messageFrom: MessageFrom
	senderInGroup: boolean
	serverMessage: boolean
}
