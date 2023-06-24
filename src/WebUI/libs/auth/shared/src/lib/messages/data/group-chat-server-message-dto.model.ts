import { MessageFrom } from './message-from.model'

export interface GroupChatServerMessageDto {
	id: string
	groupChatId: string
	content: string
	messageSentTime: string
	messageFrom: MessageFrom
}
