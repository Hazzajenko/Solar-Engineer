import { CanvasString } from '../../types'
import { CanvasStringsActions } from './canvas-strings.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const CANVAS_STRINGS_FEATURE_KEY = 'canvas-strings'

export interface CanvasStringsState extends EntityState<CanvasString> {
	loaded: boolean
	error?: string | null
}

export interface CanvasStringsPartialState {
	readonly [CANVAS_STRINGS_FEATURE_KEY]: CanvasStringsState
}

export const canvasStringsAdapter: EntityAdapter<CanvasString> = createEntityAdapter<CanvasString>({
	selectId: (string) => string.id,
})

export const initialCanvasStringsState: CanvasStringsState = canvasStringsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialCanvasStringsState,
	on(CanvasStringsActions.addString, (state, { string }) =>
		canvasStringsAdapter.addOne(string, state),
	),
	on(CanvasStringsActions.addManyStrings, (state, { strings }) =>
		canvasStringsAdapter.addMany(strings, state),
	),
	on(CanvasStringsActions.updateString, (state, { update }) =>
		canvasStringsAdapter.updateOne(update, state),
	),
	on(CanvasStringsActions.updateManyStrings, (state, { updates }) =>
		canvasStringsAdapter.updateMany(updates, state),
	),
	on(CanvasStringsActions.deleteString, (state, { stringId }) =>
		canvasStringsAdapter.removeOne(stringId, state),
	),
	on(CanvasStringsActions.deleteManyStrings, (state, { stringIds }) =>
		canvasStringsAdapter.removeMany(stringIds, state),
	),
	on(CanvasStringsActions.clearCanvasStringsState, () => initialCanvasStringsState),
)

export function canvasStringsReducer(state: CanvasStringsState | undefined, action: Action) {
	return reducer(state, action)
}
