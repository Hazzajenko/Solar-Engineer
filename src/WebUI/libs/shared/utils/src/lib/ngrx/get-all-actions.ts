import { createActionGroup } from '@ngrx/store'
import { getObjectPropertyKeys } from '../objects'
import { $ElementType } from 'utility-types'

export type ActionGroup = ReturnType<typeof createActionGroup>

export type GetActionParametersByAction<TAction> = TAction extends (params: infer P) => void
	? P
	: never

export type GetActionParametersByActionDeep<TAction> =
	GetActionParametersByAction<TAction> extends object
		? $ElementType<GetActionParametersByAction<TAction>, keyof GetActionParametersByAction<TAction>>
		: never

export type GetActionParametersByActionKey<
	TActions extends ActionGroup,
	TKey extends keyof TActions,
> = TKey extends keyof TActions ? GetActionParametersByAction<TActions[TKey]> : never

export type GetActionParametersByActionKeyDeep<
	TActions extends ActionGroup,
	TKey extends keyof TActions,
> = GetActionParametersByActionKey<TActions, TKey> extends object
	? $ElementType<
			GetActionParametersByActionKey<TActions, TKey>,
			keyof GetActionParametersByActionKey<TActions, TKey>
	  >
	: never

export type ActionReturnTypes<T> = {
	[K in keyof T]: T[K] extends (...args: any[]) => infer R ? R : never
}

/*
 const what: GetActionParametersByActionKey<typeof AppStateActions, 'setDragBoxState'> = {
 dragBox: {
 state: 'NoDragBox',
 },
 }

 type NameType = $ElementType<GetActionParametersByActionKey<typeof AppStateActions, 'setDragBoxState'>, 'dragBox'>;

 const asdasd: NameType = {
 state: 'NoDragBox',
 }

 const what2: GetActionParametersByActionKeyDeep<typeof AppStateActions, 'setDragBoxState'> = {
 state: 'NoDragBox',
 }*/

export function getAllActions(actionGroup: ActionGroup) {
	return getObjectPropertyKeys(actionGroup)
		.map((key) => actionGroup[key as keyof typeof actionGroup])
		.filter((action) => typeof action === 'function')
}

/*export const getAllActions = (actionGroup: ActionGroup) => {
 return Object.keys(actionGroup).map((key) => actionGroup[key as keyof typeof actionGroup])
 }*/

export const getAllActionsExcept = <
	TActionGroup extends ActionGroup,
	TActionKey extends keyof TActionGroup,
>(
	actionGroup: TActionGroup,
	actions: TActionKey[],
) => {
	return getAllActions(actionGroup).filter((action) =>
		actions.some((ac) => actionGroup[ac] !== action),
	)
}
// OmitByValue

/*
 export type GetActionParametersByKey<T extends keyof typeof AppStateActions> = Parameters<
 (typeof AppStateActions)[T]
 >[0]
 */

// type AppStateActionsExceptUndefined = OmitByValue<typeof AppStateActions, undefined>
/*

 export type GetActionParametersByKeyV2<T extends keyof AppStateActionsExceptUndefined> = Parameters<
 AppStateActionsExceptUndefined[T]
 >[0]
 */

/*export type GetActionParametersByKeyV2WithoutUndefined<T extends keyof typeof AppStateActions> =
 NonNullable<GetActionParametersByKey<T>>

 export type GetActionParametersByActionType<T extends string> = Parameters<
 (typeof AppStateActions)[keyof typeof AppStateActions]
 >[0]*/
/*
 export const mapStoreActionsToFunction = (store: Store<AppState>) => {
 return getObjectPropertyKeys(AppStateActions).map((key) => {
 const action = AppStateActions[key as keyof typeof AppStateActions]
 if (action.type === '[App State Store] Set Drag Box State') {
 const props = { ...action({ dragBox: DragBox }) } as (props: { dragBox: DragBox }) => {
 dragBox: DragBox
 } & TypedAction<'[App State Store] Set Drag Box State'>
 const props2: GetActionParametersByKey<'setDragBoxState'> = {
 dragBox: {
 state: 'NoDragBox',
 },
 }
 store.dispatch(action(props2))
 }
 const fn = (params: GetActionParametersByKey<typeof key>) => {
 const props = { ...params } as (props: { dragBox: DragBox }) => {
 dragBox: DragBox
 } & TypedAction<'[App State Store] Set Drag Box State'>
 store.dispatch(action(props))
 }
 const props: GetActionParametersByKeyV2WithoutUndefined<typeof key>
 return (params: GetActionParametersByKey<typeof key>) => {
 // const props = { ...params }
 // const props2: GetActionParametersByKey<typeof key> = {}
 /!*	if (getKeyByType(action.type)) {
 // store.dispatch(action(params))
 }*!/
 if (params) {
 store.dispatch(action(params))
 }
 }
 })
 }
 */

/*const getKeyByType = (type: string) => {
 return getObjectPropertyKeys(AppStateActions).find((key) => {
 return AppStateActions[key as keyof typeof AppStateActions].type === type
 })
 }*/
/*const store = inject(Store<AppState>)
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
 >*/
