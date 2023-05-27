import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { PanelLinkFromMenu, PanelLinkModel, PanelLinkRequest, PanelSymbol, StringCircuitWithIndex } from '@entities/shared'
import { PanelLinksActions } from './panel-links.actions'

/*export type LinkPathLine = {

 }*/
export const PANEL_LINKS_FEATURE_KEY = 'panelLinks'

export interface PanelLinksState extends EntityState<PanelLinkModel> {
	loaded: boolean
	error?: string | null
	requestingLink: PanelLinkRequest | undefined
	hoveringOverPanelInLinkMenuId: string | undefined
	hoveringOverPanelLinkInLinkMenu: PanelLinkFromMenu | undefined
	hoveringOverPanelLinkInApp: string | undefined
	hoveringOverPanelPolaritySymbol: PanelSymbol | undefined
	mouseDownOnPanelPolaritySymbol: PanelSymbol | undefined
	drawingPanelPolaritySymbolLine: PanelSymbol | undefined
	selectedStringCircuit: StringCircuitWithIndex | undefined
	// selectedLinkModePanelId: PanelId | undefined
	/*	linkPaint:{

	 }*/

	// | undefined
}

export const panelLinksAdapter: EntityAdapter<PanelLinkModel> = createEntityAdapter<PanelLinkModel>(
	{
		selectId: (panelLink) => panelLink.id, // sortComparer: sortPanelLinksCompareFn,
	},
)

// const adapter = createEntityAdapter<PanelLinkModel>()

export const initialPanelLinksState: PanelLinksState = panelLinksAdapter.getInitialState({
	loaded: false,
	requestingLink: undefined,
	hoveringOverPanelInLinkMenuId: undefined,
	hoveringOverPanelLinkInLinkMenu: undefined,
	hoveringOverPanelLinkInApp: undefined,
	hoveringOverPanelPolaritySymbol: undefined,
	mouseDownOnPanelPolaritySymbol: undefined,
	drawingPanelPolaritySymbolLine: undefined,
	selectedStringCircuit: undefined, // selectedLinkModePanelId: undefined,
})

const reducer = createReducer(
	initialPanelLinksState,
	on(PanelLinksActions.startPanelLink, (state, { panelLinkRequest }) => ({
		...state,
		requestingLink: panelLinkRequest,
	})),
	on(PanelLinksActions.endPanelLink, (state) => ({
		...state,
		requestingLink: undefined,
	})),
	on(PanelLinksActions.addPanelLink, (state, { panelLink }) =>
		panelLinksAdapter.addOne(panelLink, state),
	),
	on(PanelLinksActions.addManyPanelLinks, (state, { panelLinks }) =>
		panelLinksAdapter.addMany(panelLinks, state),
	),
	on(PanelLinksActions.updatePanelLink, (state, { update }) =>
		panelLinksAdapter.updateOne(update, state),
	),
	on(PanelLinksActions.updateManyPanelLinks, (state, { updates }) =>
		panelLinksAdapter.updateMany(updates, state),
	),
	on(PanelLinksActions.deletePanelLink, (state, { panelLinkId }) =>
		panelLinksAdapter.removeOne(panelLinkId, state),
	),
	on(PanelLinksActions.deleteManyPanelLinks, (state, { panelLinkIds }) =>
		panelLinksAdapter.removeMany(panelLinkIds, state),
	),
	on(PanelLinksActions.setHoveringOverPanelInLinkMenuId, (state, { panelId }) => ({
		...state,
		hoveringOverPanelInLinkMenuId: panelId,
	})),
	on(PanelLinksActions.clearHoveringOverPanelInLinkMenuId, (state) => ({
		...state,
		hoveringOverPanelInLinkMenuId: undefined,
	})),
	on(PanelLinksActions.setHoveringOverPanelLinkInLinkMenu, (state, { hoveringOverPanelLink }) => ({
		...state,
		hoveringOverPanelLinkInLinkMenu: hoveringOverPanelLink,
	})),
	on(PanelLinksActions.clearHoveringOverPanelLinkInLinkMenu, (state) => ({
		...state,
		hoveringOverPanelLinkInLinkMenu: undefined,
	})),
	on(PanelLinksActions.setSelectedStringCircuit, (state, { selectedStringCircuit }) => ({
		...state,
		selectedStringCircuit,
	})),
	on(PanelLinksActions.clearSelectedStringCircuit, (state) => ({
		...state,
		selectedStringCircuit: initialPanelLinksState.selectedStringCircuit,
	})),
	on(PanelLinksActions.setHoveringOverPanelLinkInApp, (state, { panelLinkId }) => ({
		...state,
		hoveringOverPanelLinkInApp: panelLinkId,
	})),
	on(PanelLinksActions.clearHoveringOverPanelLinkInApp, (state) => ({
		...state,
		hoveringOverPanelLinkInApp: undefined,
	})),
	on(PanelLinksActions.setHoveringOverPanelPolaritySymbol, (state, { panelSymbol }) => ({
		...state,
		hoveringOverPanelPolaritySymbol: panelSymbol,
	})),
	on(PanelLinksActions.clearHoveringOverPanelPolaritySymbol, (state) => ({
		...state,
		hoveringOverPanelPolaritySymbol: undefined,
	})),
	on(PanelLinksActions.setMouseDownOnPanelPolaritySymbol, (state, { panelSymbol }) => ({
		...state,
		mouseDownOnPanelPolaritySymbol: panelSymbol,
	})),
	on(PanelLinksActions.clearMouseDownOnPanelPolaritySymbol, (state) => ({
		...state,
		mouseDownOnPanelPolaritySymbol: undefined,
	})),
	on(PanelLinksActions.setDrawingPanelPolaritySymbolLine, (state, { panelSymbol }) => ({
		...state,
		drawingPanelPolaritySymbolLine: panelSymbol,
	})),
	on(PanelLinksActions.clearDrawingPanelPolaritySymbolLine, (state) => ({
		...state,
		drawingPanelPolaritySymbolLine: undefined,
	})),
	/*	on(PanelLinksActions.setSelectedLinkModePanelId, (state, { panelId }) => ({
	 ...state,
	 selectedLinkModePanelId: panelId,
	 })),
	 on(PanelLinksActions.clearSelectedLinkModePanelId, (state) => ({
	 ...state,
	 selectedLinkModePanelId: undefined,
	 })),*/
	on(PanelLinksActions.clearPanelLinksState, () => initialPanelLinksState),
)

export function panelLinksReducer(state: PanelLinksState | undefined, action: Action) {
	return reducer(state, action)
}

/*export const selectedFeature = createFeature({
 name: 'panelLinks',
 reducer,
 // extraSelectors: ({ selectPanelLinksState }) => adapter.getSelectors(selectPanelLinksState),
 })*/

/*

 export function injectPanelLinksFeature() {
 const store = inject(Store)
 const state = store.selectSignal(selectPanelLinksState)
 const allPanelLinks = store.selectSignal(selectAllPanelLinks)
 const entities = store.selectSignal(selectPanelLinksEntities)

 return {
 get allPanelLinks() {
 return allPanelLinks
 },
 getById(id: string) {
 return entities()[id]
 },
 getByIds(ids: string[]) {
 return ids.map((id) => entities()[id]).filter(isNotNull)
 },
 requestingLink() {
 return state().requestingLink
 },
 getByStringId(stringId: string) {
 return allPanelLinks().filter((panelLink) => panelLink.stringId === stringId)
 },
 isPanelLinkExisting(panelId: string, polarity: Polarity) {
 return !!allPanelLinks().find(
 (panelLink) =>
 (panelLink.positivePanelId === panelId && polarity === 'positive') ||
 (panelLink.negativePanelId === panelId && polarity === 'negative'),
 )
 },
 addPanelLink(panelLink: PanelLinkModel) {
 store.dispatch(PanelLinksActions.addPanelLink({ panelLink }))
 },
 addManyPanelLinks(panelLinks: PanelLinkModel[]) {
 store.dispatch(PanelLinksActions.addManyPanelLinks({ panelLinks }))
 },
 updatePanelLink(update: UpdateStr<PanelLinkModel>) {
 store.dispatch(PanelLinksActions.updatePanelLink({ update }))
 },
 updateManyPanelLinks(updates: UpdateStr<PanelLinkModel>[]) {
 store.dispatch(PanelLinksActions.updateManyPanelLinks({ updates }))
 },
 deletePanelLink(panelLinkId: string) {
 store.dispatch(PanelLinksActions.deletePanelLink({ panelLinkId }))
 },
 deleteManyPanelLinks(panelLinkIds: string[]) {
 store.dispatch(PanelLinksActions.deleteManyPanelLinks({ panelLinkIds }))
 },
 clearPanelLinksState() {
 store.dispatch(PanelLinksActions.clearPanelLinksState())
 },
 }
 }

 export type PanelLinksFeature = ReturnType<typeof injectPanelLinksFeature>
 */
