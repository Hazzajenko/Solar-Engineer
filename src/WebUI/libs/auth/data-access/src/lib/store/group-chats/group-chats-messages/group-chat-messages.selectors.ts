import {
	GROUP_CHAT_MESSAGES_FEATURE_KEY,
	groupChatMessagesAdapter,
	GroupChatMessagesState,
} from './group-chat-messages.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { GroupChatMessageModel } from '@auth/shared'

export const selectGroupChatMessagesState = createFeatureSelector<GroupChatMessagesState>(
	GROUP_CHAT_MESSAGES_FEATURE_KEY,
)

const { selectAll, selectEntities } = groupChatMessagesAdapter.getSelectors()

export const selectAllGroupChatMessages = createSelector(
	selectGroupChatMessagesState,
	(state: GroupChatMessagesState) => selectAll(state),
)

export const selectGroupChatMessagesEntities = createSelector(
	selectGroupChatMessagesState,
	(state: GroupChatMessagesState) => selectEntities(state),
)

export const selectGroupChatMessageById = (props: { id: string }) =>
	createSelector(
		selectGroupChatMessagesEntities,
		(groupChatMessages: Dictionary<GroupChatMessageModel>) => groupChatMessages[props.id],
	)

export const selectGroupChatMessagesByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllGroupChatMessages, (groupChatMessages: GroupChatMessageModel[]) =>
		groupChatMessages.filter((groupChatMessage) => props.ids.includes(groupChatMessage.id)),
	)

/*
 export const selectAllFriendsGroupedByFirstLetter = createSelector(
 selectAllGroupChatMessages,
 (groupChatMessages: GroupChatMessageModel[]) => {
 const firstLetters = group-chat-messages.map((groupChatMessage) => groupChatMessage.displayName[0])
 const uniqueFirstLetters = [...new Set(firstLetters)]
 const grouped = uniqueFirstLetters.reduce(
 (acc, firstLetter) => {
 const groupChatMessagesWithFirstLetter = group-chat-messages.filter(
 (groupChatMessage) => groupChatMessage.displayName[0] === firstLetter,
 )
 return {
 ...acc,
 [firstLetter]: groupChatMessagesWithFirstLetter,
 }
 },
 {} as {
 [key: string]: GroupChatMessageModel[]
 },
 )
 const entries = Object.entries(grouped)
 return entries.map(([firstLetter, groupChatMessages]) => {
 return {
 firstLetter,
 groupChatMessages,
 }
 })
 },
 )
 */
