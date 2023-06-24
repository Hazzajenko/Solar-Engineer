import { MessagesActions } from './messages.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { WebMessageModel } from '@auth/shared'

export const MESSAGES_FEATURE_KEY = 'messages'

export interface MessagesState extends EntityState<WebMessageModel> {
	currentAppMessageId: string | undefined
	isSearching: boolean
	messageSearchResults: WebMessageModel[]
	cachedSearchResultIds: WebMessageModel['id'][]
	cachedSearchResultEntities: WebMessageModel[]
	// friendRequestEvents: FriendRequestResponse[]
	loaded: boolean
	error?: string | null
}

export const messagesAdapter: EntityAdapter<WebMessageModel> = createEntityAdapter<WebMessageModel>(
	{
		selectId: (string) => string.id,
	},
)

/*
 export const friendRequestEventsAdapter: EntityAdapter<FriendRequestResponse> =
 createEntityAdapter<FriendRequestResponse>({
 selectId: (string) => string.id,
 })
 */

export const initialMessagesState: MessagesState = messagesAdapter.getInitialState({
	currentAppMessageId: undefined,
	loaded: false,
	isSearching: false,
	messageSearchResults: [],
	cachedSearchResultIds: [],
	cachedSearchResultEntities: [],
})

const reducer = createReducer(
	initialMessagesState,
	on(MessagesActions.searchForAppMessageByMessageName, (state) => ({
		...state,
		isSearching: true,
	})),
	on(MessagesActions.clearMessageSearchResults, (state) => ({
		...state,
		messageSearchResults: [],
		isSearching: false,
	})),
	/*	on(MessagesActions.receiveMessagesFromSearch, (state, { messages }) => ({
	 ...state,
	 messageSearchResults: messages,
	 })),*/
	/*	on(MessagesActions.receiveSearchResultsForAppMessage, (state, { response }) => ({
	 ...state,
	 messageSearchResults: response.messages,
	 })),*/
	on(MessagesActions.receiveSearchResultsForAppMessage, (state, { response }) => {
		const { messages } = response
		const cachedSearchResultIds = [...state.cachedSearchResultIds]
		const cachedSearchResultEntities = [...state.cachedSearchResultEntities]
		messages.forEach((message) => {
			if (!cachedSearchResultIds.includes(message.id)) {
				cachedSearchResultIds.push(message.id)
				cachedSearchResultEntities.push(message)
			}
		})
		const newState = messagesAdapter.addMany(messages, state)
		return {
			...newState,
			messageSearchResults: messages,
			cachedSearchResultIds,
			cachedSearchResultEntities,
		}
	}),
	on(MessagesActions.loadMessages, (state, { messages }) =>
		messagesAdapter.setMany(messages, state),
	),
	on(MessagesActions.addAppMessage, (state, { message }) => {
		return {
			...state,
			...messagesAdapter.addOne(message, state),
			currentAppMessageId: message.id,
		}
	}),
	on(MessagesActions.addMessage, (state, { message }) => messagesAdapter.addOne(message, state)),
	on(MessagesActions.addManyMessages, (state, { messages }) =>
		messagesAdapter.addMany(messages, state),
	),
	on(MessagesActions.updateMessage, (state, { update }) =>
		messagesAdapter.updateOne(update, state),
	),
	on(MessagesActions.updateManyMessages, (state, { updates }) =>
		messagesAdapter.updateMany(updates, state),
	),
	on(MessagesActions.updateManyMessagesWithString, (state, { updates }) =>
		messagesAdapter.updateMany(updates, state),
	),
	on(MessagesActions.deleteMessage, (state, { messageId }) =>
		messagesAdapter.removeOne(messageId, state),
	),
	on(MessagesActions.deleteManyMessages, (state, { messageIds }) =>
		messagesAdapter.removeMany(messageIds, state),
	),
	on(MessagesActions.addMessageNoSignalr, (state, { message }) =>
		messagesAdapter.addOne(message, state),
	),
	on(MessagesActions.addManyMessagesNoSignalr, (state, { messages }) =>
		messagesAdapter.addMany(messages, state),
	),
	on(MessagesActions.updateMessageNoSignalr, (state, { update }) =>
		messagesAdapter.updateOne(update, state),
	),
	on(MessagesActions.updateManyMessagesNoSignalr, (state, { updates }) =>
		messagesAdapter.updateMany(updates, state),
	),
	on(MessagesActions.deleteMessageNoSignalr, (state, { messageId }) =>
		messagesAdapter.removeOne(messageId, state),
	),
	on(MessagesActions.deleteManyMessagesNoSignalr, (state, { messageIds }) =>
		messagesAdapter.removeMany(messageIds, state),
	),
	on(MessagesActions.clearMessagesState, () => initialMessagesState),
)

export function messagesReducer(state: MessagesState | undefined, action: Action) {
	return reducer(state, action)
}

/*export const messagesFeature = createFeature({
 name: MESSAGES_FEATURE_KEY,
 reducer,
 // extraSelectors: ({ selectMessagesState }) => messagesAdapter.getSelectors(selectMessagesState),
 })*/
/*

 export function injectMessagesFeature() {
 const store = inject(Store)
 const allMessages = store.selectSignal(selectAllMessages)
 const entities = store.selectSignal(selectMessagesEntities)

 return {
 // get allMessages$
 get allMessages() {
 return allMessages
 },
 getById(id: string) {
 return entities()[id]
 },
 getByIds(ids: string[]) {
 return ids.map((id) => entities()[id]).filter(isNotNull)
 },
 getByStringId(stringId: string) {
 return allMessages().filter((message) => message.stringId === stringId)
 },
 addMessage(message: CanvasMessage) {
 store.dispatch(MessagesActions.addMessage({ message }))
 },
 addManyMessages(messages: CanvasMessage[]) {
 store.dispatch(MessagesActions.addManyMessages({ messages }))
 },
 updateMessage(update: UpdateStr<CanvasMessage>) {
 store.dispatch(MessagesActions.updateMessage({ update }))
 },
 updateManyMessages(updates: UpdateStr<CanvasMessage>[]) {
 store.dispatch(MessagesActions.updateManyMessages({ updates }))
 },
 deleteMessage(id: string) {
 store.dispatch(MessagesActions.deleteMessage({ messageId: id }))
 },
 deleteManyMessages(ids: string[]) {
 store.dispatch(MessagesActions.deleteManyMessages({ messageIds: ids }))
 },
 clearMessagesState() {
 store.dispatch(MessagesActions.clearMessagesState())
 },
 }
 }

 export type MessagesFeature = ReturnType<typeof injectMessagesFeature>
 */
