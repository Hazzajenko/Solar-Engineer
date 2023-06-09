import { PanelsActions } from './panels.actions'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelModel } from '@entities/shared'

export const PANELS_FEATURE_KEY = 'panels'

export interface PanelsState extends EntityState<PanelModel> {
	loaded: boolean
	error?: string | null
}

export const panelsAdapter: EntityAdapter<PanelModel> = createEntityAdapter<PanelModel>({
	selectId: (string) => string.id,
})

export const initialPanelsState: PanelsState = panelsAdapter.getInitialState({
	loaded: false,
})

const reducer = createReducer(
	initialPanelsState,
	on(PanelsActions.loadPanels, (state, { panels }) => panelsAdapter.setMany(panels, state)),
	on(PanelsActions.addPanel, (state, { panel }) => panelsAdapter.addOne(panel, state)),
	on(PanelsActions.addManyPanels, (state, { panels }) => panelsAdapter.addMany(panels, state)),
	on(PanelsActions.updatePanel, (state, { update }) => panelsAdapter.updateOne(update, state)),
	on(PanelsActions.updateManyPanels, (state, { updates }) =>
		panelsAdapter.updateMany(updates, state),
	),
	on(PanelsActions.updateManyPanelsWithString, (state, { updates }) =>
		panelsAdapter.updateMany(updates, state),
	),
	on(PanelsActions.deletePanel, (state, { panelId }) => panelsAdapter.removeOne(panelId, state)),
	on(PanelsActions.deleteManyPanels, (state, { panelIds }) =>
		panelsAdapter.removeMany(panelIds, state),
	),
	on(PanelsActions.addPanelNoSignalr, (state, { panel }) => panelsAdapter.addOne(panel, state)),
	on(PanelsActions.addManyPanelsNoSignalr, (state, { panels }) =>
		panelsAdapter.addMany(panels, state),
	),
	on(PanelsActions.updatePanelNoSignalr, (state, { update }) =>
		panelsAdapter.updateOne(update, state),
	),
	on(PanelsActions.updateManyPanelsNoSignalr, (state, { updates }) =>
		panelsAdapter.updateMany(updates, state),
	),
	on(PanelsActions.deletePanelNoSignalr, (state, { panelId }) =>
		panelsAdapter.removeOne(panelId, state),
	),
	on(PanelsActions.deleteManyPanelsNoSignalr, (state, { panelIds }) =>
		panelsAdapter.removeMany(panelIds, state),
	),
	on(PanelsActions.clearPanelsState, () => initialPanelsState),
)

export function panelsReducer(state: PanelsState | undefined, action: Action) {
	return reducer(state, action)
}

/*export const usersFeature = createFeature({
 name: PANELS_FEATURE_KEY,
 reducer,
 // extraSelectors: ({ selectPanelsState }) => panelsAdapter.getSelectors(selectPanelsState),
 })*/
/*

 export function injectPanelsFeature() {
 const store = inject(Store)
 const allPanels = store.selectSignal(selectAllPanels)
 const entities = store.selectSignal(selectPanelsEntities)

 return {
 // get allPanels$
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
 */
