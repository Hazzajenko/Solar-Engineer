import { MessageFrom } from './message-from.model'

export interface GroupChatServerMessageModel {
	id: string
	groupChatId: string
	content: string
	messageSentTime: string
	messageFrom: MessageFrom
}
