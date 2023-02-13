import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { AppUserLinkModel, UserModel } from '@shared/data-access/models'

import { UsersActions } from './users.actions'

export const USERS_FEATURE_KEY = 'users'

export interface UsersState extends EntityState<AppUserLinkModel> {
  loaded: boolean
  error?: string | null
}

export function selectUsername(a: AppUserLinkModel): string {
  return a.displayName
}

export const usersAdapter: EntityAdapter<AppUserLinkModel> = createEntityAdapter<AppUserLinkModel>({
  selectId: selectUsername,
})

export const initialUsersState: UsersState = usersAdapter.getInitialState({
  loaded: false,
})

const reducer = createReducer(
  initialUsersState,
  on(UsersActions.initUsers, (state) => ({ ...state, loaded: false, error: null })),
  on(UsersActions.addUser, (state, { user }) => usersAdapter.addOne(user, state)),
  on(UsersActions.addManyUsers, (state, { users }) => usersAdapter.addMany(users, state)),
  on(UsersActions.updateUser, (state, { update }) => usersAdapter.updateOne(update, state)),
  on(UsersActions.updateManyUsers, (state, { updates }) => usersAdapter.updateMany(updates, state)),
  on(UsersActions.removeUser, (state, { userUserName }) =>
    usersAdapter.removeOne(userUserName, state),
  ),
  on(UsersActions.removeManyUsers, (state, { userUserNames }) =>
    usersAdapter.removeMany(userUserNames, state),
  ),
  on(UsersActions.clearUsersState, (state) => usersAdapter.removeAll(state)),
)

export function usersReducer(state: UsersState | undefined, action: Action) {
  return reducer(state, action)
}
