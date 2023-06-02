import { inject, Signal } from '@angular/core'
import { MemoizedSelector, Store } from '@ngrx/store'
import { UiActions, uiFeature, UiState } from '@overlays/ui-store/data-access'
import { omit } from '@shared/utils'

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

export type UiStore = ReturnType<typeof injectUiStore>

export function injectUiStore() {
	const store = inject(Store<UiState>)
	const feature = uiFeature

	const selectors = omit(feature, 'name', 'reducer')

	/*	const select = () => {
	 return Object.keys(selectors).reduce((acc, key) => {
	 const selectorKey = key as keyof typeof selectors
	 type SelectorReturn = SelectorReturnTypes<UiStoreSelectors>[typeof selectorKey]
	 const selector = feature[key as keyof typeof feature] as MemoizedSelector<
	 Record<string, any>,
	 SelectorReturn,
	 (featureState: AuthState) => SelectorReturn
	 >
	 acc[key as keyof UiStoreSelectors] = store.selectSignal(selector) as Signal<SelectorReturn>
	 return acc
	 }, {} as Record<keyof UiStoreSelectors, Signal<SelectorReturnTypes<UiStoreSelectors>[keyof UiStoreSelectors]>>)
	 }*/

	const select = <
		T extends keyof UiStoreSelectors,
		X extends SelectorReturnTypes<UiStoreSelectors>[T],
	>(
		key: T,
	) => {
		const selector = feature[key as keyof typeof feature] as MemoizedSelector<
			Record<string, any>,
			X,
			(featureState: UiState) => X
		>
		/*		const selector = selectors[key] as MemoizedSelector<
		 Record<string, any>,
		 X,
		 (featureState: UiState) => X
		 >*/
		return store.selectSignal(selector) as Signal<X>
	}

	const dispatch = <T extends keyof UiStoreActions>(key: T, props: GetActionParametersByKey<T>) => {
		const action = UiActions[key as keyof typeof UiActions] as UiStoreActions[T]
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return store.dispatch(action(props))
	}

	/*const store_dispatch = <T extends keyof UiStoreActions>(key: T) => {
	 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	 // @ts-ignore
	 const element = feature[key as keyof typeof feature] as UiStoreActions[T]

	 UiActions.clearUiState
	 // element.
	 const res = (props: UiStoreActions[T]) => {
	 return store.dispatch(props)
	 }

	 res(UiActions.clearUiState)
	 /!*		return (props: GetActionParametersByKey<T>) => {
	 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	 // @ts-ignore
	 return store.dispatch(element(props))
	 }*!/
	 }*/

	/*	const dispatch = () => {
	 return Object.keys(UiActions).reduce((acc, key) => {
	 const k = key as keyof typeof UiActions
	 acc[k] = (props: UiStoreActions[typeof k]) => {
	 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
	 // @ts-ignore
	 return store.dispatch(UiActions[key as keyof typeof UiActions](props))
	 }
	 return acc
	 }, {} as Record<keyof UiStoreActions, (props: GetActionParametersByKey<keyof UiStoreActions>) => void>)
	 }*/

	/*	dispatch('closeContextMenu', undefined)

	 dispatch('openDialog', {dialog: {
	 component: 'MovePanelsToStringV4Component',
	 data: {
	 panelIds: ['test'],
	 }
	 }})*/

	return {
		select,
		dispatch,
	}
}

// const meow = injectAuthStore()
// const user = meow.select('selectUser')()
// const user2 = meow.dispatch().modifiedUser({})
