import { PanelsActions } from './panels.actions'
import { CanvasPanel } from '@design-app/shared'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'

export const PANELS_FEATURE_KEY = 'panels'

export interface PanelsState extends EntityState<CanvasPanel> {
	loaded: boolean
	error?: string | null
}

export const panelsAdapter: EntityAdapter<CanvasPanel> = createEntityAdapter<CanvasPanel>({
	selectId: (string) => string.id,
})

export const initialPanelsState: PanelsState = panelsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialPanelsState,
	on(PanelsActions.addPanel, (state, { panel }) => panelsAdapter.addOne(panel, state)),
	on(PanelsActions.addManyPanels, (state, { panels }) => panelsAdapter.addMany(panels, state)),
	on(PanelsActions.updatePanel, (state, { update }) => panelsAdapter.updateOne(update, state)),
	on(PanelsActions.updateManyPanels, (state, { updates }) =>
		panelsAdapter.updateMany(updates, state),
	),
	on(PanelsActions.deletePanel, (state, { panelId }) => panelsAdapter.removeOne(panelId, state)),
	on(PanelsActions.deleteManyPanels, (state, { panelIds }) =>
		panelsAdapter.removeMany(panelIds, state),
	),
	on(PanelsActions.clearPanelsState, () => initialPanelsState),
)

export function panelsReducer(state: PanelsState | undefined, action: Action) {
	return reducer(state, action)
}