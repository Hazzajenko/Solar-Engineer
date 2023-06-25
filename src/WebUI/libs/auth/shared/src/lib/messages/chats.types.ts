import { GroupChatMemberModel, GroupChatMessageModel, GroupChatMessageWithSenderModel, GroupChatModel, GroupChatReadTimeModel, InitialGroupChatMemberModel, MessageFrom, MessageModel } from './data'
import { WebUserModel } from '../users'

/*export interface GroupChatWithMessagesModel {
 id: string
 name: string
 photoUrl: string
 latestMessageTime: string | null
 latestMessage: GroupChatMessageModel
 members: InitialGroupChatMemberModel[]
 messages: GroupChatMessageModel[]
 }*/

export type GroupChatWithLatestMessageModel = GroupChatModel & {
	latestMessageTime: string
	latestMessage: GroupChatMessageModel
}

export type GroupChatWithMessagesModel = GroupChatModel & {
	latestMessageTime: string | null
	latestMessage: GroupChatMessageModel
	messages: GroupChatMessageModel[]
}

export type GroupChatCombinedMessagesAndWebMembersModel = GroupChatWithMessagesModel & {
	members: GroupChatWebMemberModel[]
	messages: GroupChatMessageWithSenderModel[]
}

export interface GroupChatCombinedModel {
	id: string
	name: string
	photoUrl: string
	permissions: GroupChatMemberPermissionsModel
	latestSentMessageTime: string
	latestSentMessage: GroupChatMessageModel
	members: GroupChatMemberModel[]
	messages: GroupChatMessageMemberModel[]
}

export interface GroupChatMessageMemberModel {
	id: string
	groupChatId: number
	senderDisplayName: string
	sender: GroupChatMemberModel
	content: string
	messageReadTimes: GroupChatReadTimeModel[]
	messageSentTime: string
	messageFrom: MessageFrom
}

export interface GroupChatMemberPermissionsModel {
	canInvite: boolean
	canKick: boolean
}

export type GroupChatWebMemberModel = InitialGroupChatMemberModel & WebUserModel

export interface MessageTimeSortModel {
	isGroup: boolean
	chatRoomName: string
	latestSentMessageTime: string
	groupChat?: GroupChatCombinedModel
	message?: MessageModel
}

export type MessageConversationPreviewModel = {
	id: string
	isGroup: boolean
	chatRoomName: string
	chatRoomPhotoUrl: string
	latestSentMessageTime: string
}

export type MessageConversationPreviewWithGroupChatModel = MessageConversationPreviewModel & {
	isGroup: true
	groupChat: GroupChatWithLatestMessageModel
}

export type MessageConversationPreviewWithMessageModel = MessageConversationPreviewModel & {
	isGroup: false
	message: MessageModel
}

export type MessageConversationPreviewCombinedModel =
	| MessageConversationPreviewWithGroupChatModel
	| MessageConversationPreviewWithMessageModel

export type UserMessageWithOtherUserModel = MessageModel & {
	otherUser: WebUserModel
}

export type UserToUserChatRoom = {
	userId: string
	otherUser: WebUserModel
	messages: MessageModel[]
}

export type UserToLatestMessageGrouped = {
	userId: string
	otherUser: WebUserModel
	latestMessage: MessageModel
}
