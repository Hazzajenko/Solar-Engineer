import { MESSAGES_FEATURE_KEY, messagesAdapter, MessagesState } from './messages.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
	MessageModel,
	MessagePreviewCombinedModel,
	MessagePreviewModel,
	MessagePreviewWithSenderModel,
	UserMessageWithOtherUserModel,
	UserToLatestMessageGrouped,
	UserToUserChatRoom,
	WebUserModel,
} from '@auth/shared'
import { assertNotNull, groupBy } from '@shared/utils'
import { selectAllUsers, selectUsersEntities } from '../users'

export const selectMessagesState = createFeatureSelector<MessagesState>(MESSAGES_FEATURE_KEY)

const { selectAll, selectEntities } = messagesAdapter.getSelectors()

export const selectAllMessages = createSelector(selectMessagesState, (state: MessagesState) =>
	selectAll(state),
)

export const selectMessagesEntities = createSelector(selectMessagesState, (state: MessagesState) =>
	selectEntities(state),
)

export const selectMessageById = (props: { id: string }) =>
	createSelector(selectMessagesEntities, (messages: Dictionary<MessageModel>) => messages[props.id])

export const selectInitialLatestMessages = createSelector(
	selectMessagesState,
	(state: MessagesState) => state.latestMessages,
)

export const selectInitialLatestMessagesWithWebUserForSender = createSelector(
	selectInitialLatestMessages,
	selectAllUsers,
	(messages: MessagePreviewModel[], users: WebUserModel[]) => {
		return messages.map((message) => {
			const lastMessageSenderDisplayName = message.isLastMessageUserSender
				? 'You'
				: users.find((user) => user.id === message.lastMessageSenderId)?.displayName
			const lastMessageSenderPhotoUrl = users.find(
				(user) => user.id === message.lastMessageSenderId,
			)?.photoUrl

			assertNotNull(lastMessageSenderDisplayName)
			assertNotNull(lastMessageSenderPhotoUrl)
			return {
				...message,
				lastMessageSenderDisplayName,
				lastMessageSenderPhotoUrl,
			} as MessagePreviewWithSenderModel
		})
	},
)

export const selectInitialLatestMessagesCombined = createSelector(
	selectInitialLatestMessages,
	selectUsersEntities,
	(messages: MessagePreviewModel[], users: Dictionary<WebUserModel>) => {
		return messages.map((message) => {
			const lastMessageSender = users[message.lastMessageSenderId]
			assertNotNull(lastMessageSender)
			const lastMessageSenderDisplayName = message.isLastMessageUserSender
				? 'You'
				: lastMessageSender.displayName

			assertNotNull(lastMessageSenderDisplayName)

			const chatName = message.isGroup
				? message.groupChatName
				: users[message.otherUserId]?.displayName
			assertNotNull(chatName)
			const chatPhotoUrl = message.isGroup ? message.groupChatPhotoUrl : lastMessageSender.photoUrl

			const lastMessageDisplayName = message.isLastMessageUserSender
				? 'You'
				: lastMessageSender.displayName

			const chatId = message.isGroup ? message.id : message.otherUserId

			return {
				...message,
				chatId,
				chatName,
				chatPhotoUrl,
				lastMessageDisplayName,
			} as MessagePreviewCombinedModel
		})
	},
)
export const selectMessagesByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllMessages, (messages: MessageModel[]) =>
		messages.filter((message) => props.ids.includes(message.id)),
	)

export const selectAllUserMessageWithOtherUser = createSelector(
	selectAllMessages,
	selectAllUsers,
	(messages: MessageModel[], users: WebUserModel[]) => {
		return messages.map((message) => {
			const otherUser = users.find((user) => user.id === message.otherUserId)
			return {
				...message,
				otherUser,
			} as UserMessageWithOtherUserModel
		})
	},
)

export const selectAllUserMessagesGroupedByUserId = createSelector(
	selectAllMessages,
	(messages: MessageModel[]) => {
		return groupBy(messages, 'otherUserId')
	},
)

export const selectAllUserMessagesByUserId = (props: { userId: string }) =>
	createSelector(
		selectAllUserMessagesGroupedByUserId,
		selectAllUsers,
		(grouped: Record<string, MessageModel[]>, users: WebUserModel[]) => {
			const messages = grouped[props.userId]
			const otherUser = users.find((user) => user.id === props.userId)
			return {
				userId: props.userId,
				otherUser,
				messages,
			} as UserToUserChatRoom
		},
	)

export const selectAllUserMessagesGroupedByUserIdWithWebUser = createSelector(
	selectAllUserMessagesGroupedByUserId,
	selectAllUsers,
	(grouped: Record<string, MessageModel[]>, users: WebUserModel[]) => {
		const entries = Object.entries(grouped)
		return entries.map(([userId, messages]) => {
			const otherUser = users.find((user) => user.id === userId)
			return {
				userId,
				otherUser,
				messages,
			} as UserToUserChatRoom
		})
	},
)

export const selectAllLatestUserMessages = createSelector(
	selectAllUserMessagesGroupedByUserIdWithWebUser,
	(
		messagesGroupedByUserId: {
			userId: string
			otherUser: WebUserModel
			messages: MessageModel[]
		}[],
	) => {
		return messagesGroupedByUserId.map(({ userId, otherUser, messages }) => {
			const latestMessage = messages[messages.length - 1]
			return {
				userId,
				otherUser,
				latestMessage,
			} as UserToLatestMessageGrouped
		})
	},
)

/*
 export const selectAllFriendsGroupedByFirstLetter = createSelector(
 selectAllMessages,
 (messages: MessageModel[]) => {
 const firstLetters = messages.map((message) => message.displayName[0])
 const uniqueFirstLetters = [...new Set(firstLetters)]
 const grouped = uniqueFirstLetters.reduce(
 (acc, firstLetter) => {
 const messagesWithFirstLetter = messages.filter(
 (message) => message.displayName[0] === firstLetter,
 )
 return {
 ...acc,
 [firstLetter]: messagesWithFirstLetter,
 }
 },
 {} as {
 [key: string]: MessageModel[]
 },
 )
 const entries = Object.entries(grouped)
 return entries.map(([firstLetter, messages]) => {
 return {
 firstLetter,
 messages,
 }
 })
 },
 )
 */
