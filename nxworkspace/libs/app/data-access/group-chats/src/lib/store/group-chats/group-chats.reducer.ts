import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GroupChatModel } from '@shared/data-access/models'

import { GroupChatsActions } from './group-chats.actions'

export const GROUP_CHATS_FEATURE_KEY = 'group-chats'

export interface GroupChatsState extends EntityState<GroupChatModel> {
  loaded: boolean
  error?: string | null
}

export function groupChatSelectId(a: GroupChatModel): number {
  return a.id
}

export const groupChatsAdapter: EntityAdapter<GroupChatModel> = createEntityAdapter<GroupChatModel>({
  selectId: groupChatSelectId,
})

export const initialGroupChatsState: GroupChatsState = groupChatsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialGroupChatsState,
  on(GroupChatsActions.initGroupChatData, (state) => ({ ...state, loaded: false, error: null })),
  on(GroupChatsActions.addGroupChat, (state, { groupChat }) =>
    groupChatsAdapter.addOne(groupChat, state),
  ),
  on(GroupChatsActions.addManyGroupChats, (state, { groupChats }) =>
    groupChatsAdapter.addMany(groupChats, state),
  ),
  on(GroupChatsActions.updateGroupChat, (state, { update }) =>
    groupChatsAdapter.updateOne(update, state),
  ),
  on(GroupChatsActions.removeGroupChat, (state, { groupChatId }) =>
    groupChatsAdapter.removeOne(groupChatId, state),
  ),
  on(GroupChatsActions.clearGroupChatsState, (state) =>
    groupChatsAdapter.removeAll(state),
  ),
)

export function groupChatsReducer(state: GroupChatsState | undefined, action: Action) {
  return reducer(state, action)
}
