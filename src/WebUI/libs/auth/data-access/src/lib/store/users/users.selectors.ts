import { USERS_FEATURE_KEY, usersAdapter, UsersState } from './users.reducer'
import { Dictionary } from '@ngrx/entity'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppUserConnectionModel, MinimalWebUser, WebUserModel } from '@auth/shared'
import { selectConnectionsEntities } from '../connections'

export const selectUsersState = createFeatureSelector<UsersState>(USERS_FEATURE_KEY)

const { selectAll, selectEntities } = usersAdapter.getSelectors()

export const selectAllUsers = createSelector(selectUsersState, (state: UsersState) =>
	selectAll(state),
)

export const selectAllUsersMappedWithConnections = createSelector(
	selectAllUsers,
	selectConnectionsEntities,
	(users: WebUserModel[], appUserConnections: Dictionary<AppUserConnectionModel>) => {
		return users.map((user) => {
			const connection = appUserConnections[user.id]
			if (!connection) {
				return user
			}
			return {
				...user,
				isFriend: user.isFriend,
				isOnline: !!connection,
				lastActiveTime: connection.lastActiveTime,
			}
		})
	},
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

export const selectUserSearchResults = createSelector(selectUsersState, (state: UsersState) =>
	state.userSearchResults.filter((u) => u.id !== state.currentAppUserId),
)

export const selectUserSearchResultById = (props: { id: string }) =>
	createSelector(selectUserSearchResults, (users: MinimalWebUser[]) =>
		users.find((u) => u.id === props.id),
	)

export const selectAllFriends = createSelector(
	selectAllUsersMappedWithConnections,
	(users: WebUserModel[]) => users.filter((user) => user.isFriend),
)

/*export const selectAllFriends = createSelector(
 selectAllUsers, (users: WebUserModel[]) =>
 users.filter((user) => user.isFriend),
 )*/

export const selectFourMostRecentFriends = createSelector(
	selectAllFriends,
	(users: WebUserModel[]) => users.slice(0, 4),
)

export const selectAllFriendsGroupedByFirstLetter = createSelector(
	selectAllFriends,
	(users: WebUserModel[]) => {
		const firstLetters = users.map((user) => user.displayName[0])
		const uniqueFirstLetters = [...new Set(firstLetters)]
		const grouped = uniqueFirstLetters.reduce(
			(acc, firstLetter) => {
				const usersWithFirstLetter = users.filter((user) => user.displayName[0] === firstLetter)
				return {
					...acc,
					[firstLetter]: usersWithFirstLetter,
				}
			},
			{} as {
				[key: string]: WebUserModel[]
			},
		)
		const entries = Object.entries(grouped)
		return entries.map(([firstLetter, users]) => {
			return {
				firstLetter,
				users,
			}
		})
	},
)
export const selectAllNonFriends = createSelector(selectAllUsers, (users: WebUserModel[]) =>
	users.filter((user) => !user.isFriend),
)
