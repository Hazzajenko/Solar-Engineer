import { StringsActions } from './strings.actions'
import { CanvasString } from '@design-app/shared'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

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