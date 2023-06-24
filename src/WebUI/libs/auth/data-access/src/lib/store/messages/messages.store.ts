import { Store } from '@ngrx/store'
import {
	selectAllFriends,
	selectAllFriendsGroupedByFirstLetter,
	selectAllMessages,
	selectAllMessagesMappedWithConnections,
	selectAllOnlineFriends,
	selectAmountOfOnlineFriends,
	selectFourMostRecentFriends,
	selectMessageById,
	selectMessageSearchResultById,
	selectMessageSearchResults,
	selectMessagesEntities,
} from './messages.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { MessagesActions } from './messages.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	MinimalWebMessage,
	SearchForAppMessageRequest,
	SearchForAppMessageResponse,
	WebMessageModel,
} from '@auth/shared'

export function injectMessagesStore(): MessagesStore {
	return messagesStoreInjector()
}

const messagesStoreInjector = createRootServiceInjector(messagesStoreFactory, {
	deps: [Store],
})

export type MessagesStore = ReturnType<typeof messagesStoreFactory>

function messagesStoreFactory(store: Store) {
	// const allMessages$ = store.select(selectAllMessages)
	const allMessages = store.selectSignal(selectAllMessages)
	const entities = store.selectSignal(selectMessagesEntities)

	const select = {
		allMessages,
		getById: (id: string) => store.selectSignal(selectMessageById({ id })),
		getByIdOrUndefined: (id: WebMessageModel['id'] | undefined) =>
			id ? entities()[id] : undefined,
		getByIds: (ids: WebMessageModel['id'][]) => ids.map((id) => entities()[id]).filter(isNotNull),
		messageSearchResults: store.selectSignal(selectMessageSearchResults),
		messageSearchResultById: (id: string) =>
			store.selectSignal(selectMessageSearchResultById({ id })),
		allFriends: store.selectSignal(selectAllFriends),
		allOnlineFriends: store.selectSignal(selectAllOnlineFriends),
		amountOfOnlineFriends: store.selectSignal(selectAmountOfOnlineFriends),
		fourMostRecentFriends: store.selectSignal(selectFourMostRecentFriends),
		allFriendsGroupedByFirstLetter: store.selectSignal(selectAllFriendsGroupedByFirstLetter),
		allMessagesMappedWithConnections: store.selectSignal(selectAllMessagesMappedWithConnections),
	}
	const dispatch = {
		removeFriend: (messageId: string) =>
			store.dispatch(MessagesActions.removeFriend({ messageId })),
		acceptFriendRequest: (messageId: string) =>
			store.dispatch(MessagesActions.acceptFriendRequest({ messageId })),
		rejectFriendRequest: (messageId: string) =>
			store.dispatch(MessagesActions.rejectFriendRequest({ messageId })),
		sendFriendRequest: (messageId: string) =>
			store.dispatch(MessagesActions.sendFriendRequest({ messageId })),
		searchForAppMessageByMessageName: (query: string) =>
			store.dispatch(MessagesActions.searchForAppMessageByMessageName({ query })),
		searchForAppMessage: (request: SearchForAppMessageRequest) =>
			store.dispatch(MessagesActions.searchForAppMessage({ request })),
		receiveMessagesFromSearch: (messages: MinimalWebMessage[]) =>
			store.dispatch(MessagesActions.receiveMessagesFromSearch({ messages })),
		receiveSearchResultsForAppMessage: (response: SearchForAppMessageResponse) =>
			store.dispatch(MessagesActions.receiveSearchResultsForAppMessage({ response })),
		clearMessageSearchResults: () => store.dispatch(MessagesActions.clearMessageSearchResults()),
		loadMessages: (messages: WebMessageModel[]) =>
			store.dispatch(MessagesActions.loadMessages({ messages })),
		addMessage: (message: WebMessageModel) =>
			store.dispatch(MessagesActions.addMessage({ message })),
		addManyMessages: (messages: WebMessageModel[]) =>
			store.dispatch(MessagesActions.addManyMessages({ messages })),
		updateMessage: (update: UpdateStr<WebMessageModel>) =>
			store.dispatch(MessagesActions.updateMessage({ update })),
		updateManyMessages: (updates: UpdateStr<WebMessageModel>[]) =>
			store.dispatch(MessagesActions.updateManyMessages({ updates })),
		deleteMessage: (messageId: WebMessageModel['id']) =>
			store.dispatch(MessagesActions.deleteMessage({ messageId })),
		deleteManyMessages: (messageIds: WebMessageModel['id'][]) =>
			store.dispatch(MessagesActions.deleteManyMessages({ messageIds })),
		clearMessagesState: () => store.dispatch(MessagesActions.clearMessagesState()),
	}

	return {
		select,
		dispatch,
	}
}
