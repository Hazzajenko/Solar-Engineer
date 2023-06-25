import { GroupChatMessagesActions } from './group-chat-messages.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GroupChatMessageModel } from '@auth/shared'

export const GROUP_CHAT_MESSAGES_FEATURE_KEY = 'groupChatMessages'

export interface GroupChatMessagesState extends EntityState<GroupChatMessageModel> {
	loaded: boolean
	error?: string | null
}

export const groupChatMessagesAdapter: EntityAdapter<GroupChatMessageModel> =
	createEntityAdapter<GroupChatMessageModel>({
		selectId: (string) => string.id,
	})

export const initialGroupChatMessagesState: GroupChatMessagesState =
	groupChatMessagesAdapter.getInitialState({
		loaded: false,
	})

const reducer = createReducer(
	initialGroupChatMessagesState,
	on(GroupChatMessagesActions.loadGroupChatMessages, (state, { groupChatMessages }) =>
		groupChatMessagesAdapter.setMany(groupChatMessages, state),
	),
	on(GroupChatMessagesActions.addGroupChatMessage, (state, { groupChatMessage }) =>
		groupChatMessagesAdapter.addOne(groupChatMessage, state),
	),
	on(GroupChatMessagesActions.addManyGroupChatMessages, (state, { groupChatMessages }) =>
		groupChatMessagesAdapter.addMany(groupChatMessages, state),
	),
	on(GroupChatMessagesActions.updateGroupChatMessage, (state, { update }) =>
		groupChatMessagesAdapter.updateOne(update, state),
	),
	on(GroupChatMessagesActions.updateManyGroupChatMessages, (state, { updates }) =>
		groupChatMessagesAdapter.updateMany(updates, state),
	),
	on(GroupChatMessagesActions.updateManyGroupChatMessagesWithString, (state, { updates }) =>
		groupChatMessagesAdapter.updateMany(updates, state),
	),
	on(GroupChatMessagesActions.deleteGroupChatMessage, (state, { groupChatMessageId }) =>
		groupChatMessagesAdapter.removeOne(groupChatMessageId, state),
	),
	on(GroupChatMessagesActions.deleteManyGroupChatMessages, (state, { groupChatMessageIds }) =>
		groupChatMessagesAdapter.removeMany(groupChatMessageIds, state),
	),
	on(GroupChatMessagesActions.addGroupChatMessageNoSignalr, (state, { groupChatMessage }) =>
		groupChatMessagesAdapter.addOne(groupChatMessage, state),
	),
	on(GroupChatMessagesActions.addManyGroupChatMessagesNoSignalr, (state, { groupChatMessages }) =>
		groupChatMessagesAdapter.addMany(groupChatMessages, state),
	),
	on(GroupChatMessagesActions.updateGroupChatMessageNoSignalr, (state, { update }) =>
		groupChatMessagesAdapter.updateOne(update, state),
	),
	on(GroupChatMessagesActions.updateManyGroupChatMessagesNoSignalr, (state, { updates }) =>
		groupChatMessagesAdapter.updateMany(updates, state),
	),
	on(GroupChatMessagesActions.deleteGroupChatMessageNoSignalr, (state, { groupChatMessageId }) =>
		groupChatMessagesAdapter.removeOne(groupChatMessageId, state),
	),
	on(
		GroupChatMessagesActions.deleteManyGroupChatMessagesNoSignalr,
		(state, { groupChatMessageIds }) =>
			groupChatMessagesAdapter.removeMany(groupChatMessageIds, state),
	),
	on(GroupChatMessagesActions.clearGroupChatMessagesState, () => initialGroupChatMessagesState),
)

export function groupChatMessagesReducer(
	state: GroupChatMessagesState | undefined,
	action: Action,
) {
	return reducer(state, action)
}
