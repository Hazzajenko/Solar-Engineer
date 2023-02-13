import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { GroupChatServerMessageModel } from '@shared/data-access/models'

export const GROUP_CHAT_SERVER_MESSAGES_FEATURE_KEY = 'group-chat-messages'

export interface GroupChatServerMessagesState extends EntityState<GroupChatServerMessageModel> {
  loaded: boolean
  error?: string | null
}

export function groupChatServerMessageSelectId(a: GroupChatServerMessageModel): number {
  return a.id
}

export const groupChatServerMessagesAdapter: EntityAdapter<GroupChatServerMessageModel> =
  createEntityAdapter<GroupChatServerMessageModel>({
    selectId: groupChatServerMessageSelectId,
  })

export const initialGroupChatServerMessagesState: GroupChatServerMessagesState =
  groupChatServerMessagesAdapter.getInitialState({
    loaded: false,
  })

/*const reducer = createReducer(
  initialGroupChatMessagesState,
  on(GroupChatMessagesActions.initGroupChatMessages, (state) => ({ ...state, loaded: false, error: null })),
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
  on(GroupChatMessagesActions.removeGroupChatMessage, (state, { groupChatMessageId }) =>
    groupChatMessagesAdapter.removeOne(groupChatMessageId, state),
  ),
  on(GroupChatMessagesActions.clearGroupChatMessagesState, (state) =>
    groupChatMessagesAdapter.removeAll(state),
  ),
)

export function groupChatMessagesReducer(state: GroupChatMessagesState | undefined, action: Action) {
  return reducer(state, action)
}*/
