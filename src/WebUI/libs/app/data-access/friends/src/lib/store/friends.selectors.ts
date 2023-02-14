import { createFeatureSelector, createSelector } from '@ngrx/store'
import {
  FRIENDS_FEATURE_KEY,
  friendsAdapter,
  FriendsState,
} from './friends.reducer'

export const selectFriendsState = createFeatureSelector<FriendsState>(FRIENDS_FEATURE_KEY)

const { selectAll, selectEntities } = friendsAdapter.getSelectors()

export const selectFriendsLoaded = createSelector(
  selectFriendsState,
  (state: FriendsState) => state.loaded,
)

export const selectFriendsError = createSelector(
  selectFriendsState,
  (state: FriendsState) => state.error,
)

export const selectAllFriends = createSelector(selectFriendsState, (state: FriendsState) =>
  selectAll(state),
)

export const selectFriendsEntities = createSelector(selectFriendsState, (state: FriendsState) =>
  selectEntities(state),
)

