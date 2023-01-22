import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  GROUP_CHATS_FEATURE_KEY,
  groupChatsAdapter,
  GroupChatsState,
} from './group-chats.reducer'

export const selectGroupChatsState = createFeatureSelector<GroupChatsState>(GROUP_CHATS_FEATURE_KEY)

const { selectAll } = groupChatsAdapter.getSelectors()

export const selectGroupChatsLoaded = createSelector(
  selectGroupChatsState,
  (state: GroupChatsState) => state.loaded,
)

export const selectGroupChatsError = createSelector(
  selectGroupChatsState,
  (state: GroupChatsState) => state.error,
)

export const selectAllGroupChats = createSelector(selectGroupChatsState, (state: GroupChatsState) =>
  selectAll(state),
)


