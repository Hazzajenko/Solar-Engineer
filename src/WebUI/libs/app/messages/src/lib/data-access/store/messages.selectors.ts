import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  MESSAGES_FEATURE_KEY,
  messagesAdapter,
  MessagesState,
} from './messages.reducer'

export const selectMessagesState = createFeatureSelector<MessagesState>(MESSAGES_FEATURE_KEY)

const { selectAll, selectEntities } = messagesAdapter.getSelectors()

export const selectMessagesLoaded = createSelector(
  selectMessagesState,
  (state: MessagesState) => state.loaded,
)

export const selectMessagesError = createSelector(
  selectMessagesState,
  (state: MessagesState) => state.error,
)

export const selectAllMessages = createSelector(selectMessagesState, (state: MessagesState) =>
  selectAll(state),
)

export const selectMessagesEntities = createSelector(selectMessagesState, (state: MessagesState) =>
  selectEntities(state),
)

