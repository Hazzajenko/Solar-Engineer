import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import { isNotNull } from '@shared/utils'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CanvasString } from '@entities/shared'
import {
	selectAllStrings,
	selectAllStringsWithPanels,
	selectStringByIdWithPanels,
	selectStringsEntities,
} from './strings.selectors'
import { StringsActions } from './strings.actions'
import { provideEffects } from '@ngrx/effects'
import * as stringsEffects from './strings.effects'
import { STRINGS_FEATURE_KEY, stringsReducer } from './strings.reducer'

export function provideStringsFeature() {
	return makeEnvironmentProviders([
		provideState(STRINGS_FEATURE_KEY, stringsReducer),
		provideEffects(stringsEffects),
	])
}

export function injectStringsStore() {
	const store = inject(Store)
	const entities = store.selectSignal(selectStringsEntities)

	return {
		get allStrings$() {
			return store.select(selectAllStrings)
		},
		get allStrings() {
			return store.selectSignal(selectAllStrings)()
		},
		getById(id: string) {
			return entities()[id]
		},
		getByIds(ids: string[]) {
			return ids.map((id) => entities()[id]).filter(isNotNull)
		},
		allStringsWithPanels() {
			return store.selectSignal(selectAllStringsWithPanels)()
		},
		allStringsWithPanels$() {
			return store.select(selectAllStringsWithPanels)
		},
		getStringByIdWithPanels(stringId: string) {
			return store.selectSignal(selectStringByIdWithPanels({ stringId }))()
		},
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

export type StringsStore = ReturnType<typeof injectStringsStore>
