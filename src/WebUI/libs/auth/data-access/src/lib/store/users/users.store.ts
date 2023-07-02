import { Store } from '@ngrx/store'
import {
	selectAllFriends,
	selectAllFriendsGroupedByFirstLetter,
	selectAllOnlineFriends,
	selectAllUsers,
	selectAllUsersMappedWithConnections,
	selectAmountOfOnlineFriends,
	selectFourMostRecentFriends,
	selectUserById,
	selectUserSearchResultById,
	selectUserSearchResults,
	selectUsersEntities,
} from './users.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { UsersActions } from './users.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	MinimalWebUser,
	SearchForAppUserRequest,
	SearchForAppUserResponse,
	WebUserModel,
} from '@auth/shared'

export function injectUsersStore(): UsersStore {
	return usersStoreInjector()
}

const usersStoreInjector = createRootServiceInjector(usersStoreFactory, {
	deps: [Store],
})

export type UsersStore = ReturnType<typeof usersStoreFactory>

function usersStoreFactory(store: Store) {
	// const allUsers$ = store.select(selectAllUsers)
	const allUsers = store.selectSignal(selectAllUsers)
	const entities = store.selectSignal(selectUsersEntities)

	const select = {
		allUsers,
		getById: (id: string) => store.selectSignal(selectUserById({ id })),
		getByIdOrUndefined: (id: WebUserModel['id'] | undefined) => (id ? entities()[id] : undefined),
		getByIds: (ids: WebUserModel['id'][]) => ids.map((id) => entities()[id]).filter(isNotNull),
		userSearchResults: store.selectSignal(selectUserSearchResults),
		userSearchResultById: (id: string) => store.selectSignal(selectUserSearchResultById({ id })),
		allFriends: store.selectSignal(selectAllFriends),
		allOnlineFriends: store.selectSignal(selectAllOnlineFriends),
		amountOfOnlineFriends: store.selectSignal(selectAmountOfOnlineFriends),
		fourMostRecentFriends: store.selectSignal(selectFourMostRecentFriends),
		allFriendsGroupedByFirstLetter: store.selectSignal(selectAllFriendsGroupedByFirstLetter),
		allUsersMappedWithConnections: store.selectSignal(selectAllUsersMappedWithConnections),
	}
	const dispatch = {
		removeFriend: (userId: string) => store.dispatch(UsersActions.removeFriend({ userId })),
		acceptFriendRequest: (userId: string) =>
			store.dispatch(UsersActions.acceptFriendRequest({ userId })),
		rejectFriendRequest: (userId: string) =>
			store.dispatch(UsersActions.rejectFriendRequest({ userId })),
		sendFriendRequest: (userId: string) =>
			store.dispatch(UsersActions.sendFriendRequest({ userId })),
		searchForAppUserByUserName: (query: string) =>
			store.dispatch(UsersActions.searchForAppUserByUserName({ query })),
		searchForAppUser: (request: SearchForAppUserRequest) =>
			store.dispatch(UsersActions.searchForAppUser({ request })),
		receiveUsersFromSearch: (users: MinimalWebUser[]) =>
			store.dispatch(UsersActions.receiveUsersFromSearch({ users })),
		receiveSearchResultsForAppUser: (response: SearchForAppUserResponse) =>
			store.dispatch(UsersActions.receiveSearchResultsForAppUser({ response })),
		clearUserSearchResults: () => store.dispatch(UsersActions.clearUserSearchResults()),
		loadUsers: (users: WebUserModel[]) => store.dispatch(UsersActions.loadUsers({ users })),
		receiveFriend: (friend: WebUserModel) => store.dispatch(UsersActions.receiveFriend({ friend })),
		addUser: (user: WebUserModel) => store.dispatch(UsersActions.addUser({ user })),
		addManyUsers: (users: WebUserModel[]) => store.dispatch(UsersActions.addManyUsers({ users })),
		updateUser: (update: UpdateStr<WebUserModel>) =>
			store.dispatch(UsersActions.updateUser({ update })),
		updateManyUsers: (updates: UpdateStr<WebUserModel>[]) =>
			store.dispatch(UsersActions.updateManyUsers({ updates })),
		deleteUser: (userId: WebUserModel['id']) => store.dispatch(UsersActions.deleteUser({ userId })),
		deleteManyUsers: (userIds: WebUserModel['id'][]) =>
			store.dispatch(UsersActions.deleteManyUsers({ userIds })),
		clearUsersState: () => store.dispatch(UsersActions.clearUsersState()),
	}

	return {
		select,
		dispatch,
	}
}
