import { Store } from '@ngrx/store'
import {
	selectAllGroupChats,
	selectGroupChatById,
	selectGroupChatsEntities,
} from './group-chats.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { GroupChatsActions } from './group-chats.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { GroupChatModel } from '@auth/shared'

export function injectGroupChatsStore(): GroupChatsStore {
	return groupChatsStoreInjector()
}

const groupChatsStoreInjector = createRootServiceInjector(groupChatsStoreFactory, {
	deps: [Store],
})

export type GroupChatsStore = ReturnType<typeof groupChatsStoreFactory>

function groupChatsStoreFactory(store: Store) {
	const allGroupChats = store.selectSignal(selectAllGroupChats)
	const entities = store.selectSignal(selectGroupChatsEntities)

	const select = {
		allGroupChats,
		getById: (id: string) => store.selectSignal(selectGroupChatById({ id })),
		getByIds: (ids: GroupChatModel['id'][]) => ids.map((id) => entities()[id]).filter(isNotNull),
	}
	const dispatch = {
		loadGroupChats: (groupChats: GroupChatModel[]) =>
			store.dispatch(GroupChatsActions.loadGroupChats({ groupChats })),
		addGroupChat: (groupChat: GroupChatModel) =>
			store.dispatch(GroupChatsActions.addGroupChat({ groupChat })),
		addManyGroupChats: (groupChats: GroupChatModel[]) =>
			store.dispatch(GroupChatsActions.addManyGroupChats({ groupChats })),
		updateGroupChat: (update: UpdateStr<GroupChatModel>) =>
			store.dispatch(GroupChatsActions.updateGroupChat({ update })),
		updateManyGroupChats: (updates: UpdateStr<GroupChatModel>[]) =>
			store.dispatch(GroupChatsActions.updateManyGroupChats({ updates })),
		deleteGroupChat: (groupChatId: GroupChatModel['id']) =>
			store.dispatch(GroupChatsActions.deleteGroupChat({ groupChatId })),
		deleteManyGroupChats: (groupChatIds: GroupChatModel['id'][]) =>
			store.dispatch(GroupChatsActions.deleteManyGroupChats({ groupChatIds })),
		clearGroupChatsState: () => store.dispatch(GroupChatsActions.clearGroupChatsState()),
	}

	return {
		select,
		dispatch,
	}
}
