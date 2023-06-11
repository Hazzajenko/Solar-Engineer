import { Store } from '@ngrx/store'
import {
	selectAllUsers,
	selectUserSearchResultById,
	selectUserSearchResults,
	selectUsersEntities,
} from './users.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { UsersActions } from './users.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { MinimalWebUser, WebUserModel } from '@users/shared'

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
		getById: (id: WebUserModel['id']) => entities()[id],
		getByIdOrUndefined: (id: WebUserModel['id'] | undefined) => (id ? entities()[id] : undefined),
		getByIds: (ids: WebUserModel['id'][]) => ids.map((id) => entities()[id]).filter(isNotNull),
		userSearchResults: store.selectSignal(selectUserSearchResults),
		userSearchResultById: (id: string) => store.selectSignal(selectUserSearchResultById({ id })),
	}

	const dispatch = {
		searchForAppUserByUserName: (query: string) =>
			store.dispatch(UsersActions.searchForAppUserByUserName({ query })),
		receiveUsersFromSearch: (users: MinimalWebUser[]) =>
			store.dispatch(UsersActions.receiveUsersFromSearch({ users })),
		loadUsers: (users: WebUserModel[]) => store.dispatch(UsersActions.loadUsers({ users })),
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
