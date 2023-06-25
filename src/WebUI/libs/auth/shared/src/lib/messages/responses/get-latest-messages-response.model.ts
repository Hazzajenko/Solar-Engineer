import { MessageFrom } from '../data'

export interface GetLatestMessagesResponse {
	messages: MessagePreviewModel[]
}

export type MessagePreviewBaseModel = {
	id: string
	isGroup: boolean
	lastMessageContent: string
	lastMessageFrom: MessageFrom
	lastMessageSenderId: string
	lastMessageSentTime: string
	isLastMessageReadByUser: boolean
	isLastMessageUserSender: boolean
}

export type MessagePreviewGroupModel = MessagePreviewBaseModel & {
	isGroup: true
	groupChatName: string
	groupChatPhotoUrl: string
}

export type MessagePreviewUserModel = MessagePreviewBaseModel & {
	isGroup: false
	otherUserId: string
}

export type MessagePreviewModel = MessagePreviewGroupModel | MessagePreviewUserModel

/*export type MessagePreviewModel = {
 id: string
 isGroup: boolean
 groupChatName: string | null
 groupChatPhotoUrl: string | null
 lastMessageContent: string
 lastMessageFrom: string
 lastMessageSenderId: string
 lastMessageSentTime: Date
 isLastMessageReadByUser: boolean
 isLastMessageUserSender: boolean
 }*/

export type MessagePreviewWithSenderModel = MessagePreviewModel & {
	lastMessageSenderDisplayName: string
	lastMessageSenderPhotoUrl: string
}

export type MessagePreviewCombinedModel = MessagePreviewBaseModel & {
	chatId: string
	chatName: string
	chatPhotoUrl: string
	lastMessageDisplayName: string
}
