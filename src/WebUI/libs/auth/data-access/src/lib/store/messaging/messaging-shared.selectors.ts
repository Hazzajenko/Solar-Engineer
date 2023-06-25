import {
	GroupChatWithLatestMessageModel,
	MessageConversationPreviewCombinedModel,
	MessageConversationPreviewWithGroupChatModel,
	MessageConversationPreviewWithMessageModel,
	UserToLatestMessageGrouped,
} from '@auth/shared'
import { createSelector } from '@ngrx/store'
import { selectAllGroupChatsWithLatestMessage } from '../group-chats'
import { selectAllLatestUserMessages } from '../messages'

export const selectAllLatestGroupChatsAndUserChats = createSelector(
	selectAllGroupChatsWithLatestMessage,
	selectAllLatestUserMessages,
	(groupChats: GroupChatWithLatestMessageModel[], userMessages: UserToLatestMessageGrouped[]) => {
		const groupChatsMapped = groupChats.map((groupChat) => {
			const result: MessageConversationPreviewWithGroupChatModel = {
				id: groupChat.id,
				isGroup: true,
				chatRoomName: groupChat.name,
				chatRoomPhotoUrl: groupChat.photoUrl,
				latestSentMessageTime: groupChat.latestMessageTime,
				groupChat,
			}
			return result
		})
		const userMessagesMapped = userMessages.map((userMessage) => {
			const result: MessageConversationPreviewWithMessageModel = {
				id: userMessage.otherUser.id,
				isGroup: false,
				chatRoomName: userMessage.otherUser.displayName,
				chatRoomPhotoUrl: userMessage.otherUser.photoUrl,
				latestSentMessageTime: userMessage.latestMessage.messageSentTime,
				message: userMessage.latestMessage,
			}
			return result
		})
		return [...groupChatsMapped, ...userMessagesMapped] as MessageConversationPreviewCombinedModel[]
	},
)
