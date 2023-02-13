import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  GROUP_CHAT_SERVER_MESSAGES_FEATURE_KEY,
  groupChatServerMessagesAdapter,
  GroupChatServerMessagesState,
} from './group-chat-server-messages.reducer'

export const selectGroupChatServerMessagesState =
  createFeatureSelector<GroupChatServerMessagesState>(GROUP_CHAT_SERVER_MESSAGES_FEATURE_KEY)

const { selectAll } = groupChatServerMessagesAdapter.getSelectors()

export const selectAllGroupServerChatMessages = createSelector(
  selectGroupChatServerMessagesState,
  (state: GroupChatServerMessagesState) => selectAll(state),
)
