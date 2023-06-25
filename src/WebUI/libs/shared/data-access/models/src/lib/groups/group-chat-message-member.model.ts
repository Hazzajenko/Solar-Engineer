import { GroupChatMemberModel, GroupChatReadTime, MessageFrom } from '..'

export interface GroupChatMessageMemberModel {
	id: number
	groupChatId: number
	senderDisplayName: string
	sender: GroupChatMemberModel
	content: string
	messageReadTimes: GroupChatReadTime[]
	messageSentTime: string
	messageFrom: MessageFrom
}
