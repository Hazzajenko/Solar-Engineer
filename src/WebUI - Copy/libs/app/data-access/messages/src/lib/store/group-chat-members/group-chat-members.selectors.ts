import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  GROUP_CHAT_MEMBERS_FEATURE_KEY,
  groupChatMembersAdapter,
  GroupChatMembersState,
} from './group-chat-members.reducer'

export const selectGroupChatMembersState = createFeatureSelector<GroupChatMembersState>(GROUP_CHAT_MEMBERS_FEATURE_KEY)

const { selectAll } = groupChatMembersAdapter.getSelectors()

export const selectGroupChatMembersLoaded = createSelector(
  selectGroupChatMembersState,
  (state: GroupChatMembersState) => state.loaded,
)

export const selectGroupChatMembersError = createSelector(
  selectGroupChatMembersState,
  (state: GroupChatMembersState) => state.error,
)

export const selectAllGroupChatMembers = createSelector(selectGroupChatMembersState, (state: GroupChatMembersState) =>
  selectAll(state),
)


