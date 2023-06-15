import { UsersActions } from './users.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { MinimalWebUser, WebUserModel } from '@auth/shared'

export const USERS_FEATURE_KEY = 'users'

export interface UsersState extends EntityState<WebUserModel> {
	currentAppUserId: string | undefined
	isSearching: boolean
	userSearchResults: MinimalWebUser[]
	// friendRequestEvents: FriendRequestResponse[]
	loaded: boolean
	error?: string | null
}

export const usersAdapter: EntityAdapter<WebUserModel> = createEntityAdapter<WebUserModel>({
	selectId: (string) => string.id,
})

/*
 export const friendRequestEventsAdapter: EntityAdapter<FriendRequestResponse> =
 createEntityAdapter<FriendRequestResponse>({
 selectId: (string) => string.id,
 })
 */

export const initialUsersState: UsersState = usersAdapter.getInitialState({
	currentAppUserId: undefined,
	loaded: false,
	isSearching: false,
	userSearchResults: [],
})

const reducer = createReducer(
	initialUsersState,
	on(UsersActions.searchForAppUserByUserName, (state) => ({
		...state,
		isSearching: true,
	})),
	on(UsersActions.clearUserSearchResults, (state) => ({
		...state,
		userSearchResults: [],
		isSearching: false,
	})),
	on(UsersActions.receiveUsersFromSearch, (state, { users }) => ({
		...state,
		userSearchResults: users,
	})),
	on(UsersActions.loadUsers, (state, { users }) => usersAdapter.setMany(users, state)),
	on(UsersActions.addAppUser, (state, { user }) => {
		return {
			...state,
			...usersAdapter.addOne(user, state),
			currentAppUserId: user.id,
		}
	}),
	on(UsersActions.addUser, (state, { user }) => usersAdapter.addOne(user, state)),
	on(UsersActions.addManyUsers, (state, { users }) => usersAdapter.addMany(users, state)),
	on(UsersActions.updateUser, (state, { update }) => usersAdapter.updateOne(update, state)),
	on(UsersActions.updateManyUsers, (state, { updates }) => usersAdapter.updateMany(updates, state)),
	on(UsersActions.updateManyUsersWithString, (state, { updates }) =>
		usersAdapter.updateMany(updates, state),
	),
	on(UsersActions.deleteUser, (state, { userId }) => usersAdapter.removeOne(userId, state)),
	on(UsersActions.deleteManyUsers, (state, { userIds }) => usersAdapter.removeMany(userIds, state)),
	on(UsersActions.addUserNoSignalr, (state, { user }) => usersAdapter.addOne(user, state)),
	on(UsersActions.addManyUsersNoSignalr, (state, { users }) => usersAdapter.addMany(users, state)),
	on(UsersActions.updateUserNoSignalr, (state, { update }) =>
		usersAdapter.updateOne(update, state),
	),
	on(UsersActions.updateManyUsersNoSignalr, (state, { updates }) =>
		usersAdapter.updateMany(updates, state),
	),
	on(UsersActions.deleteUserNoSignalr, (state, { userId }) =>
		usersAdapter.removeOne(userId, state),
	),
	on(UsersActions.deleteManyUsersNoSignalr, (state, { userIds }) =>
		usersAdapter.removeMany(userIds, state),
	),
	on(UsersActions.clearUsersState, () => initialUsersState),
)

export function usersReducer(state: UsersState | undefined, action: Action) {
	return reducer(state, action)
}

/*export const usersFeature = createFeature({
 name: USERS_FEATURE_KEY,
 reducer,
 // extraSelectors: ({ selectUsersState }) => usersAdapter.getSelectors(selectUsersState),
 })*/
/*

 export function injectUsersFeature() {
 const store = inject(Store)
 const allUsers = store.selectSignal(selectAllUsers)
 const entities = store.selectSignal(selectUsersEntities)

 return {
 // get allUsers$
 get allUsers() {
 return allUsers
 },
 getById(id: string) {
 return entities()[id]
 },
 getByIds(ids: string[]) {
 return ids.map((id) => entities()[id]).filter(isNotNull)
 },
 getByStringId(stringId: string) {
 return allUsers().filter((user) => user.stringId === stringId)
 },
 addUser(user: CanvasUser) {
 store.dispatch(UsersActions.addUser({ user }))
 },
 addManyUsers(users: CanvasUser[]) {
 store.dispatch(UsersActions.addManyUsers({ users }))
 },
 updateUser(update: UpdateStr<CanvasUser>) {
 store.dispatch(UsersActions.updateUser({ update }))
 },
 updateManyUsers(updates: UpdateStr<CanvasUser>[]) {
 store.dispatch(UsersActions.updateManyUsers({ updates }))
 },
 deleteUser(id: string) {
 store.dispatch(UsersActions.deleteUser({ userId: id }))
 },
 deleteManyUsers(ids: string[]) {
 store.dispatch(UsersActions.deleteManyUsers({ userIds: ids }))
 },
 clearUsersState() {
 store.dispatch(UsersActions.clearUsersState())
 },
 }
 }

 export type UsersFeature = ReturnType<typeof injectUsersFeature>
 */
