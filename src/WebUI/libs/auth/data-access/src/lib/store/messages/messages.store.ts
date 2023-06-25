import { Store } from '@ngrx/store'
import {
	selectAllMessages,
	selectAllUserMessagesByUserId,
	selectMessageById,
	selectMessagesEntities,
} from './messages.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { MessagesActions } from './messages.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	GetMessagesWithUserRequest,
	MessageModel,
	MessagePreviewModel,
	SendMessageRequest,
} from '@auth/shared'

export function injectMessagesStore(): MessagesStore {
	return messagesStoreInjector()
}

const messagesStoreInjector = createRootServiceInjector(messagesStoreFactory, {
	deps: [Store],
})

export type MessagesStore = ReturnType<typeof messagesStoreFactory>

function messagesStoreFactory(store: Store) {
	const allMessages = store.selectSignal(selectAllMessages)
	const entities = store.selectSignal(selectMessagesEntities)

	const select = {
		allMessages,
		getById: (id: string) => store.selectSignal(selectMessageById({ id })),
		getByIds: (ids: MessageModel['id'][]) => ids.map((id) => entities()[id]).filter(isNotNull),
		allUserMessagesByUserId: (userId: string) =>
			store.selectSignal(selectAllUserMessagesByUserId({ userId })),
	}
	const dispatch = {
		loadMessages: (messages: MessageModel[]) =>
			store.dispatch(MessagesActions.loadMessages({ messages })),
		loadLatestMessages: (messages: MessagePreviewModel[]) =>
			store.dispatch(MessagesActions.loadLatestMessages({ messages })),
		fetchMessagesByUserId: (request: GetMessagesWithUserRequest) =>
			store.dispatch(MessagesActions.fetchMessagesByUserId({ request })),
		sendMessageToUser: (request: SendMessageRequest) =>
			store.dispatch(MessagesActions.sendMessageToUser({ request })),
		addMessage: (message: MessageModel) => store.dispatch(MessagesActions.addMessage({ message })),
		addManyMessages: (messages: MessageModel[]) =>
			store.dispatch(MessagesActions.addManyMessages({ messages })),
		updateMessage: (update: UpdateStr<MessageModel>) =>
			store.dispatch(MessagesActions.updateMessage({ update })),
		updateManyMessages: (updates: UpdateStr<MessageModel>[]) =>
			store.dispatch(MessagesActions.updateManyMessages({ updates })),
		deleteMessage: (messageId: MessageModel['id']) =>
			store.dispatch(MessagesActions.deleteMessage({ messageId })),
		deleteManyMessages: (messageIds: MessageModel['id'][]) =>
			store.dispatch(MessagesActions.deleteManyMessages({ messageIds })),
		clearMessagesState: () => store.dispatch(MessagesActions.clearMessagesState()),
	}

	return {
		select,
		dispatch,
	}
}
