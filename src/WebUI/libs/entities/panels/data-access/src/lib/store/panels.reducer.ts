import { PanelsActions } from './panels.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on, provideState, Store } from '@ngrx/store'
import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideEffects } from '@ngrx/effects'
import { removeSelectedIfDeleted$ } from './panels.effects'
import { isNotNull } from '@shared/utils'
import { selectAllPanels, selectPanelsEntities } from './panels.selectors'
import { UpdateStr } from '@ngrx/entity/src/models'
import { CanvasPanel } from '../types'

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

export function providePanelsFeature() {
	return makeEnvironmentProviders([
		provideState(PANELS_FEATURE_KEY, panelsReducer),
		provideEffects({ removeSelectedIfDeleted$ }),
	])
}

/*export const usersFeature = createFeature({
 name: PANELS_FEATURE_KEY,
 reducer,
 // extraSelectors: ({ selectPanelsState }) => panelsAdapter.getSelectors(selectPanelsState),
 })*/

export function injectPanelsFeature() {
	const store = inject(Store)
	const allPanels = store.selectSignal(selectAllPanels)
	const entities = store.selectSignal(selectPanelsEntities)

	return {
		get allPanels() {
			return allPanels
		},
		getById(id: string) {
			return entities()[id]
		},
		getByIds(ids: string[]) {
			return ids.map((id) => entities()[id]).filter(isNotNull)
		},
		getByStringId(stringId: string) {
			return allPanels().filter((panel) => panel.stringId === stringId)
		},
		addPanel(panel: CanvasPanel) {
			store.dispatch(PanelsActions.addPanel({ panel }))
		},
		addManyPanels(panels: CanvasPanel[]) {
			store.dispatch(PanelsActions.addManyPanels({ panels }))
		},
		updatePanel(update: UpdateStr<CanvasPanel>) {
			store.dispatch(PanelsActions.updatePanel({ update }))
		},
		updateManyPanels(updates: UpdateStr<CanvasPanel>[]) {
			store.dispatch(PanelsActions.updateManyPanels({ updates }))
		},
		deletePanel(id: string) {
			store.dispatch(PanelsActions.deletePanel({ panelId: id }))
		},
		deleteManyPanels(ids: string[]) {
			store.dispatch(PanelsActions.deleteManyPanels({ panelIds: ids }))
		},
		clearPanelsState() {
			store.dispatch(PanelsActions.clearPanelsState())
		},
	}
}

export type PanelsFeature = ReturnType<typeof injectPanelsFeature>
