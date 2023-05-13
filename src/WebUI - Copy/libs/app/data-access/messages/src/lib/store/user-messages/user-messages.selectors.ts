import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  USER_MESSAGES_FEATURE_KEY,
  messagesAdapter,
  UserMessagesState,
} from './user-messages.reducer'

export const selectMessagesState =
  createFeatureSelector<UserMessagesState>(USER_MESSAGES_FEATURE_KEY)

const { selectAll, selectEntities } = messagesAdapter.getSelectors()

export const selectMessagesLoaded = createSelector(
  selectMessagesState,
  (state: UserMessagesState) => state.loaded,
)

export const selectMessagesError = createSelector(
  selectMessagesState,
  (state: UserMessagesState) => state.error,
)

export const selectAllMessages = createSelector(selectMessagesState, (state: UserMessagesState) =>
  selectAll(state),
)

export const selectMessagesEntities = createSelector(
  selectMessagesState,
  (state: UserMessagesState) => selectEntities(state),
)
