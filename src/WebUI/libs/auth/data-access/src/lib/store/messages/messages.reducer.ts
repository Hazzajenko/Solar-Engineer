import { MessagesActions } from './messages.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { MessageModel, MessagePreviewModel } from '@auth/shared'

export const MESSAGES_FEATURE_KEY = 'messages'

export interface MessagesState extends EntityState<MessageModel> {
	loaded: boolean
	error?: string | null
	latestMessages: MessagePreviewModel[]
}

export const messagesAdapter: EntityAdapter<MessageModel> = createEntityAdapter<MessageModel>({
	selectId: (string) => string.id, // sortComparer: (a, b) =>
	// 	new Date(b.messageSentTime).getTime() - new Date(a.messageSentTime).getTime(),
})

export const initialMessagesState: MessagesState = messagesAdapter.getInitialState({
	loaded: false,
	latestMessages: [],
})

const reducer = createReducer(
	initialMessagesState,
	on(MessagesActions.loadMessages, (state, { messages }) =>
		messagesAdapter.setMany(messages, state),
	),
	on(MessagesActions.loadLatestMessages, (state, { messages }) => ({
		...state,
		latestMessages: messages,
	})),
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
