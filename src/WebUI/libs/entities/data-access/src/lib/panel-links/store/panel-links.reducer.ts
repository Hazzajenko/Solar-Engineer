import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity'
import { Action, createReducer, on } from '@ngrx/store'
import { ClosedCircuitChain, OpenCircuitChain, PanelLinkFromMenu, PanelLinkId, PanelLinkModel, PanelLinkRequest, PanelSymbol } from '@entities/shared'
import { PanelLinksActions } from './panel-links.actions'
import { CurvedNumberLine } from '@canvas/shared'

/*export type LinkPathLine = {

 }*/
export const PANEL_LINKS_FEATURE_KEY = 'panel-links'

export interface PanelLinksState extends EntityState<PanelLinkModel> {
	loaded: boolean
	error?: string | null
	requestingLink: PanelLinkRequest | undefined
	hoveringOverPanelInLinkMenuId: string | undefined
	hoveringOverPanelLinkInLinkMenu: PanelLinkFromMenu | undefined
	hoveringOverPanelLinkInApp: string | undefined
	hoveringOverPanelPolaritySymbol: PanelSymbol | undefined
	selectedStringCircuit: {
		openCircuitChains: OpenCircuitChain[]
		closedCircuitChains: ClosedCircuitChain[]
		circuitCurvedLines: CurvedNumberLine[][]
		circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][]
	}

	// | undefined
}

export const panelLinksAdapter: EntityAdapter<PanelLinkModel> = createEntityAdapter<PanelLinkModel>(
	{
		selectId: (panelLink) => panelLink.id,
	},
)

export const initialPanelLinksState: PanelLinksState = panelLinksAdapter.getInitialState({
	loaded: false,
	requestingLink: undefined,
	hoveringOverPanelInLinkMenuId: undefined,
	hoveringOverPanelLinkInLinkMenu: undefined,
	hoveringOverPanelLinkInApp: undefined,
	hoveringOverPanelPolaritySymbol: undefined,
	selectedStringCircuit: {
		openCircuitChains: [],
		closedCircuitChains: [],
		circuitCurvedLines: [],
		circuitLinkLineTuples: [],
	},
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
	on(PanelLinksActions.setSelectedStringLinkCircuit, (state, { selectedStringCircuit }) => ({
		...state,
		selectedStringCircuit,
	})),
	on(PanelLinksActions.clearSelectedStringLinkCircuit, (state) => ({
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
	on(PanelLinksActions.setHoveringOverPanelPolaritySymbol, (state, { panelId, symbol }) => ({
		...state,
		hoveringOverPanelPolaritySymbol: {
			panelId,
			symbol,
		},
	})),
	on(PanelLinksActions.clearHoveringOverPanelPolaritySymbol, (state) => ({
		...state,
		hoveringOverPanelPolaritySymbol: undefined,
	})),
	on(PanelLinksActions.clearPanelLinksState, () => initialPanelLinksState),
)

export function panelLinksReducer(state: PanelLinksState | undefined, action: Action) {
	return reducer(state, action)
}

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
