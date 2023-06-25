import { Store } from '@ngrx/store'
import { createRootServiceInjector } from '@shared/utils'
import {
	injectGroupChatsSharedStore,
	injectMessagesStore,
	selectAllLatestGroupChatsAndUserChats,
	selectInitialLatestMessagesCombined,
} from '@auth/data-access'
import { Signal } from '@angular/core'
import { MessageConversationPreviewCombinedModel } from '@auth/shared'

export function injectMessagingSharedStore(): MessagingSharedStore {
	return messagingSharedStoreInjector()
}

const messagingSharedStoreInjector = createRootServiceInjector(messagingSharedStoreFactory, {
	deps: [Store],
})

export type MessagingSharedStore = ReturnType<typeof messagingSharedStoreFactory>

function messagingSharedStoreFactory(store: Store) {
	const messages = injectMessagesStore()
	const groupChats = injectGroupChatsSharedStore()
	const select = {
		latestPreviewChats: store.selectSignal(selectAllLatestGroupChatsAndUserChats) as Signal<
			MessageConversationPreviewCombinedModel[]
		>,
		initialLatestMessages: store.selectSignal(selectInitialLatestMessagesCombined),
	}
	return {
		select,
		groupChats,
		messages,
	}
}
