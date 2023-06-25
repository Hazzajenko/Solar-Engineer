import {
	GroupChatCombinedMessagesAndWebMembersModel,
	GroupChatMessageModel,
	GroupChatMessageWithSenderModel,
	GroupChatModel,
	GroupChatWebMemberModel,
	GroupChatWithLatestMessageModel,
	GroupChatWithMessagesModel,
	WebUserModel,
} from '@auth/shared'
import { createSelector } from '@ngrx/store'
import { selectAllGroupChats } from './group-chats'
import { selectAllGroupChatMessages } from './group-chats-messages'
import { selectAllUsers } from '../users'
import { assertNotNull } from '@shared/utils'

export const selectAllGroupChatsWithLatestMessage = createSelector(
	selectAllGroupChats,
	selectAllGroupChatMessages,
	(groupChats: GroupChatModel[], groupChatMessages: GroupChatMessageModel[]) => {
		return groupChats.map((groupChat) => {
			const messages = groupChatMessages
				.filter((groupChatMessage) => groupChatMessage.groupChatId === groupChat.id)
				.sort(
					(a, b) => new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
				)

			const latestMessage = messages[0]
			const latestMessageTime = latestMessage ? latestMessage.messageSentTime : null

			return {
				...groupChat,
				latestMessage,
				latestMessageTime,
			} as GroupChatWithLatestMessageModel
		})
	},
)

export const selectAllGroupChatsWithMessages = createSelector(
	selectAllGroupChats,
	selectAllGroupChatMessages,
	(groupChats: GroupChatModel[], groupChatMessages: GroupChatMessageModel[]) => {
		return groupChats.map((groupChat) => {
			const messages = groupChatMessages
				.filter((groupChatMessage) => groupChatMessage.groupChatId === groupChat.id)
				.sort(
					(a, b) => new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
				)

			const latestMessage = messages[0]
			const latestMessageTime = latestMessage ? latestMessage.messageSentTime : null

			return {
				...groupChat,
				messages,
				latestMessage,
				latestMessageTime,
			} as GroupChatWithMessagesModel
		})
	},
)

export const selectAllGroupChatsWithMessagesAndWebUsers = createSelector(
	selectAllGroupChatsWithMessages,
	selectAllUsers,
	(groupChatsWithMessages: GroupChatWithMessagesModel[], users: WebUserModel[]) => {
		return groupChatsWithMessages.map((groupChat) => {
			const members = groupChat.members.map((member) => {
				const user = users.find((user) => user.id === member.appUserId)
				assertNotNull(user, `User with id ${member.appUserId} not found`)
				return {
					...member,
					...user,
				} as GroupChatWebMemberModel
			})
			const messages = groupChat.messages.map((message) => {
				const sender = members.find((member) => member.id === message.senderId)
				return {
					...message,
					sender,
				} as GroupChatMessageWithSenderModel
			})
			return {
				...groupChat,
				members,
				messages,
			} as GroupChatCombinedMessagesAndWebMembersModel
		})
	},
)
