import { GroupChatsActions } from './group-chats.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GroupChatModel } from '@auth/shared'

export const GROUP_CHATS_FEATURE_KEY = 'groupChats'

export interface GroupChatsState extends EntityState<GroupChatModel> {
	loaded: boolean
	error?: string | null
}

export const groupChatsAdapter: EntityAdapter<GroupChatModel> = createEntityAdapter<GroupChatModel>(
	{
		selectId: (string) => string.id,
	},
)

export const initialGroupChatsState: GroupChatsState = groupChatsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialGroupChatsState,
	on(GroupChatsActions.loadGroupChats, (state, { groupChats }) =>
		groupChatsAdapter.setMany(groupChats, state),
	),
	on(GroupChatsActions.addGroupChat, (state, { groupChat }) =>
		groupChatsAdapter.addOne(groupChat, state),
	),
	on(GroupChatsActions.addManyGroupChats, (state, { groupChats }) =>
		groupChatsAdapter.addMany(groupChats, state),
	),
	on(GroupChatsActions.updateGroupChat, (state, { update }) =>
		groupChatsAdapter.updateOne(update, state),
	),
	on(GroupChatsActions.updateManyGroupChats, (state, { updates }) =>
		groupChatsAdapter.updateMany(updates, state),
	),
	on(GroupChatsActions.updateManyGroupChatsWithString, (state, { updates }) =>
		groupChatsAdapter.updateMany(updates, state),
	),
	on(GroupChatsActions.deleteGroupChat, (state, { groupChatId }) =>
		groupChatsAdapter.removeOne(groupChatId, state),
	),
	on(GroupChatsActions.deleteManyGroupChats, (state, { groupChatIds }) =>
		groupChatsAdapter.removeMany(groupChatIds, state),
	),
	on(GroupChatsActions.addGroupChatNoSignalr, (state, { groupChat }) =>
		groupChatsAdapter.addOne(groupChat, state),
	),
	on(GroupChatsActions.addManyGroupChatsNoSignalr, (state, { groupChats }) =>
		groupChatsAdapter.addMany(groupChats, state),
	),
	on(GroupChatsActions.updateGroupChatNoSignalr, (state, { update }) =>
		groupChatsAdapter.updateOne(update, state),
	),
	on(GroupChatsActions.updateManyGroupChatsNoSignalr, (state, { updates }) =>
		groupChatsAdapter.updateMany(updates, state),
	),
	on(GroupChatsActions.deleteGroupChatNoSignalr, (state, { groupChatId }) =>
		groupChatsAdapter.removeOne(groupChatId, state),
	),
	on(GroupChatsActions.deleteManyGroupChatsNoSignalr, (state, { groupChatIds }) =>
		groupChatsAdapter.removeMany(groupChatIds, state),
	),
	on(GroupChatsActions.clearGroupChatsState, () => initialGroupChatsState),
)

export function groupChatsReducer(state: GroupChatsState | undefined, action: Action) {
	return reducer(state, action)
}
