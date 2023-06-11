import { Signal } from '@angular/core'
import { Store } from '@ngrx/store'
import { createRootServiceInjector } from '@shared/utils'
import { hubsFeature } from './hubs.feature'
import { HubConnection } from '@microsoft/signalr'
import { HubsState } from './hubs.reducer'
import { HubsActions } from './hubs.actions'

export function injectHubsStore(): HubsStore {
	return hubsStoreInjector()
}

const hubsStoreInjector = createRootServiceInjector(hubsStoreFactory, {
	deps: [Store],
})

export type HubsStore = ReturnType<typeof hubsStoreFactory>

function hubsStoreFactory(store: Store) {
	const feature = hubsFeature

	const state = store.selectSignal(feature.selectHubsState) as Signal<HubsState>

	const usersHub = store.selectSignal(feature.selectUsersHub) as Signal<HubConnection | undefined>

	const projectsHub = store.selectSignal(feature.selectProjectsHub) as Signal<
		HubConnection | undefined
	>

	const select = {
		state,
		usersHub,
		projectsHub,
	}

	const dispatch = {
		usersHubConnected: (usersHubConnection: HubConnection) =>
			store.dispatch(HubsActions.usersHubConnected({ usersHubConnection })),
		projectsHubConnected: (projectsHubConnection: HubConnection) =>
			store.dispatch(HubsActions.projectsHubConnected({ projectsHubConnection })),
	}

	return {
		select,
		dispatch,
	}
}

/*

 export type HubsStoreSelectors = Omit<typeof hubsFeature, 'name' | 'reducer'>

 export type SelectorReturnTypes<T> = {
 [K in keyof T]: T[K] extends MemoizedSelector<infer S, infer R> ? R : never
 }

 export type HubsStoreSelectorsReturnTypes = SelectorReturnTypes<HubsStoreSelectors>
 /!*const what : HubsStoreSelectorsReturnTypes['selectUser'] = {

 }*!/
 export type HubsStoreActions = typeof HubsActions

 export type HubsStoreActionsReturnTypes = ActionReturnTypes<HubsStoreActions>

 export type ActionParameters<T> = {
 [K in keyof T]: T[K] extends (...args: infer P) => void ? P : never
 }

 export type GetActionParametersByKey<T> = T extends keyof ActionParameters<HubsStoreActions>
 ? // ? ActionParameters<HubsStoreActions>[T]
 ActionParameters<HubsStoreActions>[T][0]
 : never

 /!*const idk: GetActionParametersByKey<'signInSuccess'> = {
 token: 'string',
 hub: {
 id: 'string',
 }
 }*!/

 export type GetActionParametersByAction<T> = T extends (params: infer P) => void ? P : never

 export type GetActionParametersByActionKey<T> = T extends keyof HubsStoreActions
 ? GetActionParametersByAction<HubsStoreActions[T]>
 : never

 // const whattt: GetActionParametersByActionKey<'signInSuccess'>

 export type GetActionDispatchers<T> = {
 [K in keyof T]: T[K] extends (...args: any[]) => void ? (...args: any[]) => void : never
 }

 export type GetActionDispatchersByKey<T> = T extends keyof HubsStoreActions
 ? (props: GetActionParametersByKey<T>) => void
 : never

 /!*export type GetActionDispatchersByAction<T> = T extends (params: infer P) => void
 ? (...args: P) => void
 : never*!/

 const idkksadd: GetActionDispatchersByKey<'signInSuccess'> = (props: {
 token: string
 hub: HubConnection
 }) => {}

 export type StoreActionDispatcherFunctions = GetActionDispatchers<HubsStoreActions>
 */
