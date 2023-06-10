import { USERS_FEATURE_KEY, usersAdapter, UsersState } from './users.reducer'
import { WebUserModel } from '@users/shared'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY)

const { selectAll, selectEntities } = usersAdapter.getSelectors()

export const selectAllUsers = createSelector(selectUsersState, (state: UsersState) =>
	selectAll(state),
)

export const selectUsersEntities = createSelector(selectUsersState, (state: UsersState) =>
	selectEntities(state),
)

export const selectUserById = (props: { id: string }) =>
	createSelector(selectUsersEntities, (users: Dictionary<WebUserModel>) => users[props.id])

export const selectUsersByIdArray = (props: { ids: string[] }) =>
	createSelector(selectAllUsers, (users: WebUserModel[]) =>
		users.filter((user) => props.ids.includes(user.id)),
	)
