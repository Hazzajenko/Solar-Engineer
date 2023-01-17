import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { FriendModel } from '@shared/data-access/models'

import { FriendsActions } from './friends.actions'

export const FRIENDS_FEATURE_KEY = 'friends'

export interface FriendsState extends EntityState<FriendModel> {
  loaded: boolean
  error?: string | null
}

export function selectUsername(a: FriendModel): string {
  return a.username
}

export const friendsAdapter: EntityAdapter<FriendModel> = createEntityAdapter<FriendModel>({
  selectId: selectUsername,
})

export const initialFriendsState: FriendsState = friendsAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialFriendsState,
  on(FriendsActions.initFriends, (state) => ({ ...state, loaded: false, error: null })),
  on(FriendsActions.addFriend, (state, { friend }) =>
    friendsAdapter.addOne(friend, state),
  ),
  on(FriendsActions.addManyFriends, (state, { friends }) =>
    friendsAdapter.addMany(friends, state),
  ),
  on(FriendsActions.removeFriend, (state, { friendUsername }) =>
    friendsAdapter.removeOne(friendUsername, state),
  ),
  on(FriendsActions.clearFriendsState, (state) =>
    friendsAdapter.removeAll(state),
  ),
)

export function friendsReducer(state: FriendsState | undefined, action: Action) {
  return reducer(state, action)
}
