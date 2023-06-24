import { MESSAGES_FEATURE_KEY, messagesAdapter, MessagesState } from './messages.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppMessageConnectionModel, MinimalWebMessage, WebMessageModel } from '@auth/shared'
import { selectConnectionsEntities } from '../connections'

export const selectMessagesState = createFeatureSelector<MessagesState>(MESSAGES_FEATURE_KEY)

const { selectAll, selectEntities } = messagesAdapter.getSelectors()

export const selectAllMessages = createSelector(selectMessagesState, (state: MessagesState) =>
	selectAll(state),
)

export const selectAllMessagesMappedWithConnections = createSelector(
	selectAllMessages,
	selectConnectionsEntities,
	(messages: WebMessageModel[], appMessageConnections: Dictionary<AppMessageConnectionModel>) => {
		return messages.map((message) => {
			const connection = appMessageConnections[message.id]
			if (!connection) {
				return message
			}
			return {
				...message,
				isFriend: message.isFriend,
				isOnline: !!connection,
				lastActiveTime: connection.lastActiveTime,
			}
		})
	},
)

export const selectMessagesEntities = createSelector(selectMessagesState, (state: MessagesState) =>
	selectEntities(state),
)

export const selectMessageById = (props: { id: string }) =>
	createSelector(
		selectMessagesEntities,
		(messages: Dictionary<WebMessageModel>) => messages[props.id],
	)

export const selectMessagesByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllMessages, (messages: WebMessageModel[]) =>
		messages.filter((message) => props.ids.includes(message.id)),
	)

export const selectMessageSearchResults = createSelector(
	selectMessagesState,
	(state: MessagesState) =>
		state.messageSearchResults.filter((u) => u.id !== state.currentAppMessageId),
)

export const selectMessageSearchResultById = (props: { id: string }) =>
	createSelector(selectMessageSearchResults, (messages: MinimalWebMessage[]) =>
		messages.find((u) => u.id === props.id),
	)

export const selectAllFriends = createSelector(
	selectAllMessagesMappedWithConnections,
	(messages: WebMessageModel[]) => messages.filter((message) => message.isFriend),
)

export const selectAllOnlineFriends = createSelector(
	selectAllFriends,
	(messages: WebMessageModel[]) => messages.filter((message) => message.isOnline),
)

export const selectAmountOfOnlineFriends = createSelector(
	selectAllOnlineFriends,
	(messages: WebMessageModel[]) => messages.length,
)

/*export const selectAllFriends = createSelector(
 selectAllMessages, (messages: WebMessageModel[]) =>
 messages.filter((message) => message.isFriend),
 )*/

export const selectFourMostRecentFriends = createSelector(
	selectAllFriends,
	(messages: WebMessageModel[]) => messages.slice(0, 4),
)

export const selectAllFriendsGroupedByFirstLetter = createSelector(
	selectAllFriends,
	(messages: WebMessageModel[]) => {
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
				[key: string]: WebMessageModel[]
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
export const selectAllNonFriends = createSelector(
	selectAllMessages,
	(messages: WebMessageModel[]) => messages.filter((message) => !message.isFriend),
)
