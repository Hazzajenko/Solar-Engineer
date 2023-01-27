import { createFeatureSelector, createSelector } from '@ngrx/store'
import { USERS_FEATURE_KEY, usersAdapter, UsersState } from './users.reducer'
import { RouterSelectors } from '@shared/data-access/router'

export const selectUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY)

const { selectAll } = usersAdapter.getSelectors()

export const selectUsersLoaded = createSelector(
  selectUsersState,
  (state: UsersState) => state.loaded,
)

export const selectUsersError = createSelector(selectUsersState, (state: UsersState) => state.error)

export const selectAllUsers = createSelector(selectUsersState, (state: UsersState) =>
  selectAll(state),
)

export const selectUserByRouteParams = createSelector(
  selectUsersState,
  selectAllUsers,
  RouterSelectors.selectRouteParams,
  (state, users, { userName }) => {
    return users.find((user) => user.userName === userName)
  },
)
