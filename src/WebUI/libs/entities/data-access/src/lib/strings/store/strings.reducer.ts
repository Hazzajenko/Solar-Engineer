import { StringsActions } from './strings.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on, provideState } from '@ngrx/store'
import { makeEnvironmentProviders } from '@angular/core'
import { provideEffects } from '@ngrx/effects'
import { createStringNotification$ } from './strings.effects'
import { CanvasString } from '@entities/shared'

export const STRINGS_FEATURE_KEY = 'strings'

export interface StringsState extends EntityState<CanvasString> {
	loaded: boolean
	error?: string | null
}

export const stringsAdapter: EntityAdapter<CanvasString> = createEntityAdapter<CanvasString>({
	selectId: (string) => string.id,
})

export const initialStringsState: StringsState = stringsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialStringsState,
	on(StringsActions.addString, (state, { string }) => stringsAdapter.addOne(string, state)),
	on(StringsActions.addManyStrings, (state, { strings }) => stringsAdapter.addMany(strings, state)),
	on(StringsActions.updateString, (state, { update }) => stringsAdapter.updateOne(update, state)),
	on(StringsActions.updateManyStrings, (state, { updates }) =>
		stringsAdapter.updateMany(updates, state),
	),
	on(StringsActions.deleteString, (state, { stringId }) =>
		stringsAdapter.removeOne(stringId, state),
	),
	on(StringsActions.deleteManyStrings, (state, { stringIds }) =>
		stringsAdapter.removeMany(stringIds, state),
	),
	on(StringsActions.clearStringsState, () => initialStringsState),
)

export function stringsReducer(state: StringsState | undefined, action: Action) {
	return reducer(state, action)
}

export function provideStringsFeature() {
	return makeEnvironmentProviders([
		provideState(STRINGS_FEATURE_KEY, stringsReducer),
		provideEffects({ createStringNotification$ }),
	])
}

/*

 export function injectStringsFeature() {
 const store = inject(Store)
 const allStrings = store.selectSignal(selectAllStrings)
 const entities = store.selectSignal(selectStringsEntities)

 return {
 get allStrings() {
 return allStrings
 },
 getById(id: string) {
 return entities()[id]
 },
 getByIds(ids: string[]) {
 return ids.map((id) => entities()[id]).filter(isNotNull)
 } /!*		allStringsWithPanels() {
 return store.selectSignal(selectAllStringsWithPanels)
 },*!/,
 addString(string: CanvasString) {
 store.dispatch(StringsActions.addString({ string }))
 },
 addManyStrings(strings: CanvasString[]) {
 store.dispatch(StringsActions.addManyStrings({ strings }))
 },
 updateString(update: UpdateStr<CanvasString>) {
 store.dispatch(StringsActions.updateString({ update }))
 },
 updateManyStrings(updates: UpdateStr<CanvasString>[]) {
 store.dispatch(StringsActions.updateManyStrings({ updates }))
 },
 deleteString(id: string) {
 store.dispatch(StringsActions.deleteString({ stringId: id }))
 },
 deleteManyStrings(ids: string[]) {
 store.dispatch(StringsActions.deleteManyStrings({ stringIds: ids }))
 },
 clearStringsState() {
 store.dispatch(StringsActions.clearStringsState())
 },
 }
 }

 export type StringsFeature = ReturnType<typeof injectStringsFeature>
 */
