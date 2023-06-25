import { Store } from '@ngrx/store'
import {
	selectAllGroupChatMessages,
	selectGroupChatMessageById,
	selectGroupChatMessagesEntities,
} from './group-chat-messages.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { GroupChatMessagesActions } from './group-chat-messages.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { GroupChatMessageModel } from '@auth/shared'

export function injectGroupChatMessagesStore(): GroupChatMessagesStore {
	return groupChatMessagesStoreInjector()
}

const groupChatMessagesStoreInjector = createRootServiceInjector(groupChatMessagesStoreFactory, {
	deps: [Store],
})

export type GroupChatMessagesStore = ReturnType<typeof groupChatMessagesStoreFactory>

function groupChatMessagesStoreFactory(store: Store) {
	const allGroupChatMessages = store.selectSignal(selectAllGroupChatMessages)
	const entities = store.selectSignal(selectGroupChatMessagesEntities)

	const select = {
		allGroupChatMessages,
		getById: (id: string) => store.selectSignal(selectGroupChatMessageById({ id })),
		getByIds: (ids: GroupChatMessageModel['id'][]) =>
			ids.map((id) => entities()[id]).filter(isNotNull),
	}
	const dispatch = {
		loadGroupChatMessages: (groupChatMessages: GroupChatMessageModel[]) =>
			store.dispatch(GroupChatMessagesActions.loadGroupChatMessages({ groupChatMessages })),
		addGroupChatMessage: (groupChatMessage: GroupChatMessageModel) =>
			store.dispatch(GroupChatMessagesActions.addGroupChatMessage({ groupChatMessage })),
		addManyGroupChatMessages: (groupChatMessages: GroupChatMessageModel[]) =>
			store.dispatch(GroupChatMessagesActions.addManyGroupChatMessages({ groupChatMessages })),
		updateGroupChatMessage: (update: UpdateStr<GroupChatMessageModel>) =>
			store.dispatch(GroupChatMessagesActions.updateGroupChatMessage({ update })),
		updateManyGroupChatMessages: (updates: UpdateStr<GroupChatMessageModel>[]) =>
			store.dispatch(GroupChatMessagesActions.updateManyGroupChatMessages({ updates })),
		deleteGroupChatMessage: (groupChatMessageId: GroupChatMessageModel['id']) =>
			store.dispatch(GroupChatMessagesActions.deleteGroupChatMessage({ groupChatMessageId })),
		deleteManyGroupChatMessages: (groupChatMessageIds: GroupChatMessageModel['id'][]) =>
			store.dispatch(GroupChatMessagesActions.deleteManyGroupChatMessages({ groupChatMessageIds })),
		clearGroupChatMessagesState: () =>
			store.dispatch(GroupChatMessagesActions.clearGroupChatMessagesState()),
	}

	return {
		select,
		dispatch,
	}
}
