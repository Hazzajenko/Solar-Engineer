import { GroupChatReadTimeModel } from './group-chat-read-time.model'
import { MessageFrom } from './message-from.model'
import { WebUserModel } from '../../users'

export interface GroupChatMessageModel {
	id: string
	groupChatId: string
	senderId: string
	senderDisplayName: string
	content: string
	messageReadTimes: GroupChatReadTimeModel[]
	messageSentTime: string
	messageFrom: MessageFrom
	senderInGroup: boolean
}

export type GroupChatMessageWithSenderModel = GroupChatMessageModel & {
	sender: WebUserModel
}
