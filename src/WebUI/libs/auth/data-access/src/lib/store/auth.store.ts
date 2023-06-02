import { inject, Signal } from '@angular/core'
import { AuthActions, authFeature, AuthState } from '@auth/data-access'
import { MemoizedSelector, Store } from '@ngrx/store'
import { AuthUserModel } from '@shared/data-access/models'

export type AuthStoreSelectors = Omit<typeof authFeature, 'name' | 'reducer'>

export type SelectorReturnTypes<T> = {
	[K in keyof T]: T[K] extends MemoizedSelector<infer S, infer R> ? R : never
}

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
export function injectAuthStore() {
	const store = inject(Store<AuthState>)
	const feature = authFeature

	const select = <T extends keyof AuthStoreSelectors, X extends AuthStoreSelectorsReturnTypes[T]>(
		key: T,
	) => {
		const element = feature[key as keyof typeof feature] as MemoizedSelector<
			Record<string, any>,
			X,
			(featureState: AuthState) => X
		>
		return store.selectSignal(element) as Signal<X>
	}

	const store_dispatch = <T extends keyof AuthStoreActions>(key: T) => {
		const element = feature[key as keyof typeof feature] as AuthStoreActions[T]
		// element.
		return (props: GetActionParametersByKey<T>) => {
			if (props) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				return store.dispatch(element(props))
			}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return store.dispatch(element())
		}
		// return store.dispatch(element)
	}

	const dispatch = () => {
		return Object.keys(feature).reduce((acc, key) => {
			acc[key as keyof AuthStoreActions] = store_dispatch(key as keyof AuthStoreActions)
			return acc
		}, {} as Record<keyof AuthStoreActions, (props: GetActionParametersByKey<keyof AuthStoreActions>) => void>)
	}

	return {
		select,
		dispatch,
	}
}

// const meow = injectAuthStore()
// const user = meow.select('selectUser')()
// const user2 = meow.dispatch().modifiedUser({})
