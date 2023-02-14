import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  GROUP_CHAT_MESSAGES_FEATURE_KEY,
  groupChatMessagesAdapter,
  GroupChatMessagesState,
} from './group-chat-messages.reducer'

export const selectGroupChatMessagesState = createFeatureSelector<GroupChatMessagesState>(GROUP_CHAT_MESSAGES_FEATURE_KEY)

const { selectAll } = groupChatMessagesAdapter.getSelectors()

export const selectGroupChatMessagesLoaded = createSelector(
  selectGroupChatMessagesState,
  (state: GroupChatMessagesState) => state.loaded,
)

export const selectGroupChatMessagesError = createSelector(
  selectGroupChatMessagesState,
  (state: GroupChatMessagesState) => state.error,
)

export const selectAllGroupChatMessages = createSelector(selectGroupChatMessagesState, (state: GroupChatMessagesState) =>
  selectAll(state),
)


