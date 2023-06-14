import { Signal } from '@angular/core'
import { AuthActions, authFeature, AuthState } from '@auth/data-access'
import { Store } from '@ngrx/store'
import { AppUserModel } from '@shared/data-access/models'
import { createRootServiceInjector } from '@shared/utils'

export function injectGetCurrentUserFactory(): Signal<AppUserModel | undefined> {
	return getCurrentUserFactoryInjector()
}

const getCurrentUserFactoryInjector = createRootServiceInjector(getCurrentUserFactory, {
	deps: [Store],
})

function getCurrentUserFactory(store: Store) {
	return store.selectSignal(authFeature.selectUser) as Signal<AppUserModel | undefined>
}

export function injectAuthStore(): AuthStore {
	return authStoreInjector()
}

const authStoreInjector = createRootServiceInjector(authStoreFactory, {
	deps: [Store],
})

export type AuthStore = ReturnType<typeof authStoreFactory>

function authStoreFactory(store: Store) {
	const feature = authFeature

	const state = store.selectSignal(feature.selectAuthState) as Signal<AuthState>

	const user = store.selectSignal(feature.selectUser) as Signal<AppUserModel | undefined>

	const guest = store.selectSignal(feature.selectGuest) as Signal<boolean>

	const select = {
		state,
		user,
		guest,
	}

	const dispatch = {
		signInAsGuest: () => store.dispatch(AuthActions.signInAsGuest()),
		signInWithGithub: () => store.dispatch(AuthActions.signInWithGithub()),
		signInWithGoogle: () => store.dispatch(AuthActions.signInWithGoogle()),
		isReturningUser: () => store.dispatch(AuthActions.isReturningUser()),
		signOut: () => store.dispatch(AuthActions.signOut()),
	}

	return {
		select,
		dispatch,
	}
}

/*

 export type AuthStoreSelectors = Omit<typeof authFeature, 'name' | 'reducer'>

 export type SelectorReturnTypes<T> = {
 [K in keyof T]: T[K] extends MemoizedSelector<infer S, infer R> ? R : never
 }

 export type AuthStoreSelectorsReturnTypes = SelectorReturnTypes<AuthStoreSelectors>
 /!*const what : AuthStoreSelectorsReturnTypes['selectUser'] = {

 }*!/
 export type AuthStoreActions = typeof AuthActions

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

 // const whattt: GetActionParametersByActionKey<'signInSuccess'>

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
 user: AppUserModel
 }) => {}

 export type StoreActionDispatcherFunctions = GetActionDispatchers<AuthStoreActions>
 */
