import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from './app-state.reducer'
import { appStateFeature } from './app-state.feature'
import { AppStateActions } from './app-state.actions'
import { DragBox, ModeState, PreviewAxisState, ViewPositioningState } from './app-state.types'
import { FunctionKeys } from 'utility-types'

export type AppStateStore = ReturnType<typeof injectAppStateStore>

export function injectAppStateStore() {
	const store = inject(Store<AppState>)
	// const acs = mapStoreActionsToFunction(store)
	// console.log('acs', acs)
	// acs[3]({ previewAxis: {} as PreviewAxisState })
	const appState = () => store.selectSignal(appStateFeature.selectAppStateState)()
	const dragBox = () => store.selectSignal(appStateFeature.selectDragBox)()
	const mode = () => store.selectSignal(appStateFeature.selectMode)()
	const pointer = () => store.selectSignal(appStateFeature.selectPointer)()
	const view = () => store.selectSignal(appStateFeature.selectView)()
	const previewAxis = () => store.selectSignal(appStateFeature.selectPreviewAxis)()
	const setHoveringOverEntityState = (hoveringOverEntityId: string) =>
		store.dispatch(AppStateActions.setHoveringOverEntity({ hoveringOverEntityId }))
	const liftHoveringOverEntity = () => store.dispatch(AppStateActions.liftHoveringOverEntity())

	const setDragBoxState = (dragBox: DragBox) =>
		store.dispatch(AppStateActions.setDragBoxState({ dragBox }))

	const setViewPositioningState = (view: ViewPositioningState) =>
		store.dispatch(AppStateActions.setViewPositioningState({ view }))

	const setModeState = (mode: ModeState) => store.dispatch(AppStateActions.setModeState({ mode }))
	const setPreviewAxisState = (previewAxis: PreviewAxisState) =>
		store.dispatch(AppStateActions.setPreviewAxisState({ previewAxis }))

	return {
		appState,
		dragBox,
		mode,
		pointer,
		view,
		previewAxis,
		setHoveringOverEntityState,
		liftHoveringOverEntity,
		setDragBoxState,
		setViewPositioningState,
		setModeState,
		setPreviewAxisState,
	}
}

AppStateActions['setModeState'].call(AppStateActions, { mode: 'LinkMode' })
export type AppStoreActions = typeof AppStateActions
export type AppStoreSelectors = Omit<typeof appStateFeature, 'name' | 'reducer'>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const appStoreSelectors = (({ name, reducer, ...obj }) => obj)(appStateFeature)

Object.getOwnPropertyNames(AppStateActions).map((key) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const action = AppStateActions[key as keyof typeof AppStateActions]
	return
})
const appStoreActionsFns = AppStateActions.setModeState
// export type AppStoreSelectors = typeof appStoreSelectors

type ParametersOfActionFn<T> = FunctionKeys<(typeof AppStateActions)['setModeState']>
const action2 = AppStateActions['setModeState']({ mode: 'LinkMode' })
type idkdkdkd = Parameters<(typeof AppStateActions)['setModeState']>[0]

type GetActionParametersByAction<T> = T extends (params: infer P) => void ? P : never
// type ParametersOfActionFn<T> = T extends (params: infer P) => void ? P : never
/*export const injectTestStore = () => {
 const store = inject(Store<AppState>)
 const actionFns2 = getObjectPropertyKeys(AppStateActions).map((key) => {
 const action = AppStateActions[key as keyof typeof AppStateActions]
 return (params: GetActionParametersByKey<typeof key>) => {
 const props = { ...params }
 store.dispatch(action(props as any))
 }
 }) as unknown as PropertyKey[] &
 GetActionParametersByKey<
 | 'setPreviewAxisState'
 | 'setModeState'
 | 'setHoveringOverEntity'
 | 'setViewPositioningState'
 | 'setDragBoxState'
 | 'liftHoveringOverEntity'
 | 'clearState'
 >
 const actionsObj = reducePropertyKeyArrayToObject(actionFns2)
 // const actionsObj3 = reducePropertyKeyArrayToObjectV3(actionFns2)
 console.log(actionsObj)
 const actionsObj4 = reducePropertyKeyArrayToObjectV4(actionFns2)
 console.log(actionsObj4)
 // actionsObj4.
 // actionsObj3

 return {
 select: appStoreSelectors,
 dispatch: actionFns2,
 }
 }*/
/*const newStore = () => {
 const store = inject(Store<AppState>)
 const actionFns2 = getObjectPropertyKeys(AppStateActions).map((key) => {
 const action = AppStateActions[key as keyof typeof AppStateActions]
 return (params: GetActionParametersByKey<typeof key>) => {
 const props = { ...params }
 store.dispatch(action(props as any))
 }
 }) as unknown as PropertyKey[] &
 GetActionParametersByKey<
 | 'setPreviewAxisState'
 | 'setModeState'
 | 'setHoveringOverEntity'
 | 'setViewPositioningState'
 | 'setDragBoxState'
 | 'liftHoveringOverEntity'
 | 'clearState'
 >
 const actionsObj = reducePropertyKeyArrayToObject(actionFns2)
 // const actionsObj3 = reducePropertyKeyArrayToObjectV3(actionFns2)
 const actionsObj4 = reducePropertyKeyArrayToObjectV4(actionFns2)
 // actionsObj4.
 // actionsObj3

 return {
 select: appStoreSelectors,
 dispatch: actionFns2,
 }
 }*/

// newStore().dispatch[0]({ mode: 'LinkMode' })
// appStateFeature.reducer(AppState, AppStoreActions[K])
export type ActionsOf<T> = {
	[K in keyof T]: {
		key: K
	}
}[keyof T]
// const idklklk : AppStoreActions['setHoveringOverEntity'] = props => ({ hoveringOverEntityId: string; } & TypedAction<"[App State Store] Set Hovering Over Entity">)

type ActionsV1 = {
	[K in keyof AppStoreActions]: {
		key: K
		// params: appStateFeature.reducer(AppState, AppStoreActions[K])
	}
}[keyof AppStoreActions]

type ActionsV2 = {
	[K in keyof AppStoreActions]: {
		key: K
		params: Parameters<AppStoreActions[K]>
	}
}[keyof AppStoreActions]

const asdas: ActionsV2 = {
	key: 'setHoveringOverEntity',
	params: [{ hoveringOverEntityId: 'test' }],
}

type ActionsV2ToFunc<T extends keyof AppStoreActions> = (
	key: T,
	...params: Parameters<AppStoreActions[T]>
) => Parameters<AppStoreActions[T]>

// const asdasdasas: ActionsV2ToFunc<'setHoveringOverEntity'> = (key, params) => {params.hoveringOverEntityId}

/*const setHoveringOverEntity = (
 key: 'setHoveringOverEntity',
 params: Parameters<AppStoreActions['setHoveringOverEntity']>,
 ) => {}*/

type ActionsV3 = {
	[K in keyof AppStoreActions]: (
		key: K,
		...params: Parameters<AppStoreActions[K]>
	) => ReturnType<AppStoreActions[K]>
}[keyof AppStoreActions]

// const assaddas: ActionsV3 = (, params) => {}

type ActionsV4 = {
	[K in keyof AppStoreActions]: (
		...params: Parameters<AppStoreActions[K]>
	) => ReturnType<AppStoreActions[K]>
}

// const assaddas: ActionsV4 = {
// 	setHoveringOverEntity: (params) => {},
// }
export type AppStoreActionFunctions = {
	[K in keyof AppStoreActions]: AppStoreActions[K] extends (...args: any[]) => any
		? AppStoreActions[K]
		: never
}

/*const funnc: AppStoreActionFunctions = {
 setHoveringOverEntity: (props: { hoveringOverEntityId: string }) =>
 ({ hoveringOverEntityId: string } & TypedAction<'[App State Store] Set Hovering Over Entity'>),
 liftHoveringOverEntity: () => {},
 setDragBoxState: () => {},
 setModeState: () => {},
 setPreviewAxisState: () => {},
 setViewPositioningState: () => {},
 clearState: () => {},
 }*/
/*

 const test: AppStoreActionFunctions['setHoveringOverEntity'] = {
 type: '[App State Store] Set Hovering Over Entity',
 arguments: { hoveringOverEntityId: 'test' },
 }

 const idk = ActionCreator<
 '[App State Store] Set Hovering Over Entity',
 (props: { hoveringOverEntityId: string }) => {
 hoveringOverEntityId: string
 } & TypedAction<'[App State Store] Set Hovering Over Entity'>
 >

 export type AppStoreSelectorFunctions = {
 [K in keyof AppStoreSelectors]: AppStoreSelectors[K] extends (...args: any[]) => any
 ? AppStoreSelectors[K]
 : never
 }
 export const appStore = {}
 */
