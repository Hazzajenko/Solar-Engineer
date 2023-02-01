import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { GroupChatMemberModel, InitialGroupChatMemberModel } from '@shared/data-access/models'

import { GroupChatMembersActions } from './group-chat-members.actions'

export const GROUP_CHAT_MEMBERS_FEATURE_KEY = 'group-chat-members'

export interface GroupChatMembersState extends EntityState<InitialGroupChatMemberModel> {
  loaded: boolean
  error?: string | null
}

export function groupChatMemberSelectId(a: InitialGroupChatMemberModel): number {
  return a.id
}

export const groupChatMembersAdapter: EntityAdapter<InitialGroupChatMemberModel> =
  createEntityAdapter<InitialGroupChatMemberModel>({
    selectId: groupChatMemberSelectId,
  })

export const initialGroupChatMembersState: GroupChatMembersState =
  groupChatMembersAdapter.getInitialState({
    loaded: false,
  })

const reducer = createReducer(
  initialGroupChatMembersState,
  on(GroupChatMembersActions.initGroupChatMembers, (state) => ({
    ...state,
    loaded: false,
    error: null,
  })),
  on(GroupChatMembersActions.addGroupChatMember, (state, { groupChatMember }) =>
    groupChatMembersAdapter.addOne(groupChatMember, state),
  ),
  on(GroupChatMembersActions.addManyGroupChatMembers, (state, { groupChatMembers }) =>
    groupChatMembersAdapter.addMany(groupChatMembers, state),
  ),
  on(GroupChatMembersActions.updateGroupChatMember, (state, { update }) =>
    groupChatMembersAdapter.updateOne(update, state),
  ),
  on(GroupChatMembersActions.removeGroupChatMember, (state, { groupChatMemberId }) =>
    groupChatMembersAdapter.removeOne(groupChatMemberId, state),
  ),
  on(GroupChatMembersActions.removeManyGroupChatMembers, (state, { groupChatMemberIds }) =>
    groupChatMembersAdapter.removeMany(groupChatMemberIds, state),
  ),
  on(GroupChatMembersActions.clearGroupChatMembersState, (state) =>
    groupChatMembersAdapter.removeAll(state),
  ),
)

export function groupChatMembersReducer(state: GroupChatMembersState | undefined, action: Action) {
  return reducer(state, action)
}
