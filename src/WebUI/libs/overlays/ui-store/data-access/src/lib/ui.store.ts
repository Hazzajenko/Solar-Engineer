import { MemoizedSelector, Store } from '@ngrx/store'
import { UiActions, uiFeature } from '@overlays/ui-store/data-access'
import {
	createRootServiceInjector,
	GetActionParametersByActionKey,
	GetActionParametersByActionKeyDeep,
} from '@shared/utils'

export type UiStoreSelectors = Omit<typeof uiFeature, 'name' | 'reducer'>

export type SelectorReturnTypes<T> = {
	[K in keyof T]: T[K] extends MemoizedSelector<infer S, infer R> ? R : never
}

export type UiStoreActions = typeof UiActions

export type ActionParameters<T> = {
	[K in keyof T]: T[K] extends (...args: infer P) => void ? P : never
}

export type GetActionParametersByKey<T> = T extends keyof ActionParameters<UiStoreActions>
	? // ? ActionParameters<AuthStoreActions>[T]
	  ActionParameters<UiStoreActions>[T][0]
	: never
/*

 export type AuthStoreSelectorsReturnTypes = SelectorReturnTypes<AuthStoreSelectors>
 export type AuthStoreActions = typeof AuthActions
 export type ActionReturnTypes<T> = {
 [K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never
 }

 export type AuthStoreActionsReturnTypes = ActionReturnTypes<AuthStoreActions>

 export type ActionParameters<T> = {
 [K in keyof T]: T[K] extends (...args: infer P) => void ? P : never
 }

 export type GetActionParametersByKey<T> = T extends keyof ActionParameters<AuthStoreActions>
 ? // ? ActionParameters<AuthStoreActions>[T]
 ActionParameters<AuthStoreActions>[T][0]
 : never

 /!*const idk: GetActionParametersByKey<'signInSuccess'> = {
 token: 'string',
 user: {
 id: 'string',
 }
 }*!/

 export type GetActionParametersByAction<T> = T extends (params: infer P) => void ? P : never

 export type GetActionParametersByActionKey<T> = T extends keyof AuthStoreActions
 ? GetActionParametersByAction<AuthStoreActions[T]>
 : never

 export type GetActionDispatchers<T> = {
 [K in keyof T]: T[K] extends (...args: any[]) => void ? (...args: any[]) => void : never
 }

 export type GetActionDispatchersByKey<T> = T extends keyof AuthStoreActions
 ? (props: GetActionParametersByKey<T>) => void
 : never

 /!*export type GetActionDispatchersByAction<T> = T extends (params: infer P) => void
 ? (...args: P) => void
 : never*!/

 const idkksadd: GetActionDispatchersByKey<'signInSuccess'> = (props: {
 token: string
 user: AuthUserModel
 }) => {}

 export type StoreActionDispatcherFunctions = GetActionDispatchers<AuthStoreActions>*/
/*const asdsadasd: StoreActionDispatcherFunctions = {
 signInSuccess: (props: {token: string, user: AuthUserModel}) => {},
 signInError: (props: {error: string}) => {},
 signInFetchUserSuccess: (props: {user: AuthUserModel}) => {},

 }*/

// export type StoreActionDispatcherFunctions2
/*
 export type GetActionDispatchersByKey2<T> = T extends keyof AuthStoreActions
 ? (props: GetActionParametersByKey<T>) => void
 : never
 */

// const idk: AuthStoreActionsReturnTypes['signInSuccess'] = {
/*	token: 'string',
 user: {
 id: 'string',
 email: 'string',
 firstName: 'string',
 }
 }*/
export function injectUiStore(): UiStore {
	return uiStoreInjector()
}

const uiStoreInjector = createRootServiceInjector(uiStoreFactory, {
	deps: [Store],
})

export type UiStore = ReturnType<typeof uiStoreFactory>

export function uiStoreFactory(store: Store) {
	// const store = inject(Store<UiState>)
	const feature = uiFeature

	const select = {
		state: store.selectSignal(feature.selectUiState),
		currentDialog: store.selectSignal(feature.selectCurrentDialog),
		currentContextMenu: store.selectSignal(feature.selectCurrentContextMenu),
		sideUiNavOpen: store.selectSignal(feature.selectSideUiNavOpen),
	}

	const dispatch = {
		openDialog: (dialog: GetActionParametersByActionKeyDeep<UiStoreActions, 'openDialog'>) =>
			store.dispatch(UiActions.openDialog({ dialog })),
		closeDialog: () => store.dispatch(UiActions.closeDialog()),
		openContextMenu: ({
			contextMenu,
		}: GetActionParametersByActionKey<UiStoreActions, 'openContextMenu'>) =>
			store.dispatch(UiActions.openContextMenu({ contextMenu })),
		closeContextMenu: () => store.dispatch(UiActions.closeContextMenu()),
		toggleSideUiNav: () => store.dispatch(UiActions.toggleSideUiNav()),
	}

	return {
		select,
		dispatch,
	}
}

// const meow = injectAuthStore()
// const user = meow.select('selectUser')()
// const user2 = meow.dispatch().modifiedUser({})
