import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GroupChatMessageModel } from '@shared/data-access/models'

import { GroupChatMessagesActions } from './group-chat-messages.actions'

export const GROUP_CHAT_MESSAGES_FEATURE_KEY = 'group-chat-messages'

export interface GroupChatMessagesState extends EntityState<GroupChatMessageModel> {
  loaded: boolean
  error?: string | null
}

export function groupChatMessageSelectId(a: GroupChatMessageModel): number {
  return a.id
}

export const groupChatMessagesAdapter: EntityAdapter<GroupChatMessageModel> = createEntityAdapter<GroupChatMessageModel>({
  selectId: groupChatMessageSelectId,
})

export const initialGroupChatMessagesState: GroupChatMessagesState = groupChatMessagesAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialGroupChatMessagesState,
  on(GroupChatMessagesActions.initGroupChatMessages, (state) => ({ ...state, loaded: false, error: null })),
  on(GroupChatMessagesActions.addGroupChatMessage, (state, { groupChatMessage }) =>
    groupChatMessagesAdapter.addOne(groupChatMessage, state),
  ),
  on(GroupChatMessagesActions.addManyGroupChatMessage, (state, { groupChatMessages }) =>
    groupChatMessagesAdapter.addMany(groupChatMessages, state),
  ),
  on(GroupChatMessagesActions.updateGroupChatMessage, (state, { update }) =>
    groupChatMessagesAdapter.updateOne(update, state),
  ),
  on(GroupChatMessagesActions.updateManyGroupChatMessages, (state, { updates }) =>
    groupChatMessagesAdapter.updateMany(updates, state),
  ),
  on(GroupChatMessagesActions.removeGroupChatMessage, (state, { groupChatMessageId }) =>
    groupChatMessagesAdapter.removeOne(groupChatMessageId, state),
  ),
  on(GroupChatMessagesActions.clearGroupChatMessagesState, (state) =>
    groupChatMessagesAdapter.removeAll(state),
  ),
)

export function groupChatMessagesReducer(state: GroupChatMessagesState | undefined, action: Action) {
  return reducer(state, action)
}
