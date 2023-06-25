import { Store } from '@ngrx/store'
import { createRootServiceInjector } from '@shared/utils'
import {
	injectGroupChatMessagesStore,
	injectGroupChatsStore,
	selectAllGroupChatsWithMessagesAndWebUsers,
} from '@auth/data-access'

export function injectGroupChatsSharedStore(): GroupChatsSharedStore {
	return groupChatsSharedStoreInjector()
}

const groupChatsSharedStoreInjector = createRootServiceInjector(groupChatsSharedStoreFactory, {
	deps: [Store],
})

export type GroupChatsSharedStore = ReturnType<typeof groupChatsSharedStoreFactory>

function groupChatsSharedStoreFactory(store: Store) {
	const chats = injectGroupChatsStore()
	const messages = injectGroupChatMessagesStore()
	const select = {
		allWebGroupChats: store.selectSignal(selectAllGroupChatsWithMessagesAndWebUsers),
	}
	return {
		select,
		chats,
		messages,
	}
}
