import { inject, Signal } from '@angular/core'
import { AuthActions, authFeature, AuthState } from '@auth/data-access'
import { MemoizedSelector, Store } from '@ngrx/store'
import { AuthUserModel } from '@shared/data-access/models'

export type AuthStoreSelectors = Omit<typeof authFeature, 'name' | 'reducer'>

export type SelectorReturnTypes<T> = {
	[K in keyof T]: T[K] extends MemoizedSelector<infer S, infer R> ? R : never
}

export type AuthStoreSelectorsReturnTypes = SelectorReturnTypes<AuthStoreSelectors>
/*const what : AuthStoreSelectorsReturnTypes['selectUser'] = {

 }*/
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

/*const idk: GetActionParametersByKey<'signInSuccess'> = {
 token: 'string',
 user: {
 id: 'string',
 }
 }*/

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

/*export type GetActionDispatchersByAction<T> = T extends (params: infer P) => void
 ? (...args: P) => void
 : never*/

const idkksadd: GetActionDispatchersByKey<'signInSuccess'> = (props: {
	token: string
	user: AuthUserModel
}) => {}

export type StoreActionDispatcherFunctions = GetActionDispatchers<AuthStoreActions>
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

export type AuthStore = ReturnType<typeof injectAuthStore>

export function injectAuthStore() {
	const store = inject(Store)
	const feature = authFeature
	/*
	 const select = <T extends (typeof selectors)[keyof typeof selectors] & Parameters<typeof store.selectSignal>[0]>(selector: T) => {
	 // const selector = selectors[key]
	 // assertIsMemoizedSelector(selector)
	 selector.setResult
	 return store.selectSignal(selector) as Signal<ReturnType<T>>
	 }
	 */

	const state = store.selectSignal(feature.selectAuthState) as Signal<AuthState>

	const user = store.selectSignal(feature.selectUser) as Signal<AuthUserModel | undefined>

	const select = {
		state,
		user,
	}

	const dispatch = {
		signInWithGoogle: () => store.dispatch(AuthActions.signInWithGoogle()),
		isReturningUser: () => store.dispatch(AuthActions.isReturningUser()), // signIn: (props: GetActionParametersByKey<'signIn'>) => store.dispatch(AuthActions.signInSuccess(props)),
	}

	return {
		select,
		dispatch,
	}
}
