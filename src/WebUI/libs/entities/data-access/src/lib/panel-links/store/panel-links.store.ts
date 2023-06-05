import { Store } from '@ngrx/store'
import {
	selectAllPanelLinks,
	selectHoveringOverPanelInLinkMenuId,
	selectHoveringOverPanelLinkInApp,
	selectHoveringOverPanelLinkInLinkMenu,
	selectPanelLinksEntities,
	selectRequestingLink,
	selectSelectedStringCircuit,
} from './panel-links.selectors'
import { createRootServiceInjector, isNotNull } from '@shared/utils'
import { PanelLinksActions } from './panel-links.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	PanelId,
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelSymbol,
	Polarity,
	StringCircuitWithIndex,
	StringId,
} from '@entities/shared'
import { PanelLinksState } from './panel-links.reducer'

export function injectPanelLinksStore(): PanelLinksStore {
	return panelLinksStoreInjector()
}

const panelLinksStoreInjector = createRootServiceInjector(panelLinksStoreFactory, {
	deps: [Store],
})

export type PanelLinksStore = ReturnType<typeof panelLinksStoreFactory>

function panelLinksStoreFactory(store: Store) {
	// const state = store.selectSignal(selectPanelLinksState)
	const allPanelLinks = store.selectSignal(selectAllPanelLinks)
	const hoveringOverPanelInLinkMenuId = store.selectSignal(selectHoveringOverPanelInLinkMenuId)
	const hoveringOverPanelLinkInLinkMenu = store.selectSignal(selectHoveringOverPanelLinkInLinkMenu)
	const requestingLink = store.selectSignal(selectRequestingLink)
	const selectedStringCircuit = store.selectSignal(selectSelectedStringCircuit)
	const hoveringOverPanelLinkInApp = store.selectSignal(selectHoveringOverPanelLinkInApp)
	const entities = store.selectSignal(selectPanelLinksEntities)

	const select = {
		allPanelLinks,
		getById: (id: PanelLinkId) => entities()[id],
		getByIds: (ids: PanelLinkId[]) => ids.map((id) => entities()[id]).filter(isNotNull),
		getByStringId: (stringId: StringId) =>
			allPanelLinks().filter((panelLink) => panelLink.stringId === stringId),
		getByPanelId: (panelId: PanelId) =>
			allPanelLinks().filter(
				(panelLink) =>
					panelLink.positivePanelId === panelId || panelLink.negativePanelId === panelId,
			),
		getByPanelIds: (panelIds: PanelId[]) =>
			allPanelLinks().filter(
				(panelLink) =>
					panelIds.includes(panelLink.positivePanelId) ||
					panelIds.includes(panelLink.negativePanelId),
			),
		getLinksMappedByPanelId: (panelId: PanelId) => ({
			positiveToLink: allPanelLinks().find((panelLink) => panelLink.positivePanelId === panelId),
			negativeToLink: allPanelLinks().find((panelLink) => panelLink.negativePanelId === panelId),
		}),
		isPanelLinkExisting: (panelId: PanelId, polarity: Polarity) =>
			!!allPanelLinks().find(
				(panelLink) =>
					(panelLink.positivePanelId === panelId && polarity === 'positive') ||
					(panelLink.negativePanelId === panelId && polarity === 'negative'),
			),
		hoveringOverPanelInLinkMenuId,
		hoveringOverPanelLinkInLinkMenu,
		requestingLink,
		selectedStringCircuit,
		hoveringOverPanelLinkInApp,
	}

	const dispatch = {
		startPanelLink: (panelLinkRequest: PanelLinkRequest) =>
			store.dispatch(PanelLinksActions.startPanelLink({ panelLinkRequest })),
		endPanelLink: () => store.dispatch(PanelLinksActions.endPanelLink()),
		setHoveringOverPanelInLinkMenuId: (panelId: PanelId) =>
			store.dispatch(PanelLinksActions.setHoveringOverPanelInLinkMenuId({ panelId })),
		clearHoveringOverPanelInLinkMenuId: () =>
			store.dispatch(PanelLinksActions.clearHoveringOverPanelInLinkMenuId()),
		setHoveringOverPanelLinkInLinkMenu: (
			hoveringOverPanelLink: NonNullable<PanelLinksState['hoveringOverPanelLinkInLinkMenu']>,
		) =>
			store.dispatch(
				PanelLinksActions.setHoveringOverPanelLinkInLinkMenu({
					hoveringOverPanelLink,
				}),
			),
		clearHoveringOverPanelLinkInLinkMenu: () =>
			store.dispatch(PanelLinksActions.clearHoveringOverPanelLinkInLinkMenu()),
		setSelectedStringLinkCircuit: (selectedStringCircuit: StringCircuitWithIndex) =>
			store.dispatch(
				PanelLinksActions.setSelectedStringCircuit({
					selectedStringCircuit,
				}),
			),
		clearSelectedStringLinkCircuit: () =>
			store.dispatch(PanelLinksActions.clearSelectedStringCircuit()),
		setHoveringOverPanelLinkInApp: (panelLinkId: PanelLinkId) =>
			store.dispatch(
				PanelLinksActions.setHoveringOverPanelLinkInApp({
					panelLinkId,
				}),
			),
		clearHoveringOverPanelLinkInApp: () =>
			store.dispatch(PanelLinksActions.clearHoveringOverPanelLinkInApp()),
		setHoveringOverPanelPolaritySymbol: (panelSymbol: PanelSymbol) =>
			store.dispatch(PanelLinksActions.setHoveringOverPanelPolaritySymbol({ panelSymbol })),
		clearHoveringOverPanelPolaritySymbol: () =>
			store.dispatch(PanelLinksActions.clearHoveringOverPanelPolaritySymbol()),
		setMouseDownOnPanelPolaritySymbol: (panelSymbol: PanelSymbol) =>
			store.dispatch(PanelLinksActions.setMouseDownOnPanelPolaritySymbol({ panelSymbol })),
		clearMouseDownOnPanelPolaritySymbol: () =>
			store.dispatch(PanelLinksActions.clearMouseDownOnPanelPolaritySymbol()),
		setDrawingPanelPolaritySymbolLine: (panelSymbol: PanelSymbol) =>
			store.dispatch(PanelLinksActions.setDrawingPanelPolaritySymbolLine({ panelSymbol })),
		clearDrawingPanelPolaritySymbolLine: () =>
			store.dispatch(PanelLinksActions.clearDrawingPanelPolaritySymbolLine()),
		addPanelLink: (panelLink: PanelLinkModel) =>
			store.dispatch(PanelLinksActions.addPanelLink({ panelLink })),
		addPanelLinks: (panelLinks: PanelLinkModel[]) =>
			store.dispatch(PanelLinksActions.addManyPanelLinks({ panelLinks })),
		updatePanelLink: (update: UpdateStr<PanelLinkModel>) =>
			store.dispatch(PanelLinksActions.updatePanelLink({ update })),
		updatePanelLinks: (updates: UpdateStr<PanelLinkModel>[]) =>
			store.dispatch(PanelLinksActions.updateManyPanelLinks({ updates })),
		deletePanelLink: (panelLinkId: PanelLinkId) =>
			store.dispatch(PanelLinksActions.deletePanelLink({ panelLinkId })),
		deletePanelLinks: (panelLinkIds: PanelLinkId[]) =>
			store.dispatch(PanelLinksActions.deleteManyPanelLinks({ panelLinkIds })),
		clearPanelLinksState: () => store.dispatch(PanelLinksActions.clearPanelLinksState()),
	}

	return {
		select,
		dispatch /*get allPanelLinks() {
		 return allPanelLinks()
		 },
		 get hoveringOverPanelInLinkMenuId() {
		 return store.selectSignal(selectHoveringOverPanelInLinkMenuId)()
		 },
		 get hoveringOverPanelLinkInLinkMenu() {
		 return store.selectSignal(selectHoveringOverPanelLinkInLinkMenu)()
		 },
		 get requestingLink() {
		 return store.selectSignal(selectRequestingLink)()
		 // return state().requestingLink
		 },
		 get getSelectedStringCircuit() {
		 return store.selectSignal(selectSelectedStringCircuit)()
		 },
		 get getHoveringOverPanelLinkInApp() {
		 return store.selectSignal(selectHoveringOverPanelLinkInApp)()
		 },
		 get getHoveringOverPanelPolaritySymbol() {
		 return store.selectSignal(selectHoveringOverPanelPolaritySymbol)()
		 },
		 get getMouseDownOnPanelPolaritySymbol() {
		 return store.selectSignal(selectMouseDownOnPanelPolaritySymbol)()
		 },
		 get drawingPanelPolaritySymbolLine() {
		 return store.selectSignal(selectDrawingPanelPolaritySymbolLine)()
		 },
		 getById(id: string) {
		 return entities()[id]
		 },
		 getByIds(ids: string[]) {
		 return ids.map((id) => entities()[id]).filter(isNotNull)
		 },
		 getByStringId(stringId: string) {
		 return allPanelLinks().filter((panelLink) => panelLink.stringId === stringId)
		 },
		 getByPanelId(panelId: string) {
		 return allPanelLinks().filter(
		 (panelLink) =>
		 panelLink.positivePanelId === panelId || panelLink.negativePanelId === panelId,
		 )
		 },
		 getByPanelIds(panelIds: string[]) {
		 return allPanelLinks().filter(
		 (panelLink) =>
		 panelIds.includes(panelLink.positivePanelId) ||
		 panelIds.includes(panelLink.negativePanelId),
		 )
		 },
		 getLinksMappedByPanelId(panelId: string) {
		 return {
		 positiveToLink: allPanelLinks().find((panelLink) => panelLink.positivePanelId === panelId),
		 negativeToLink: allPanelLinks().find((panelLink) => panelLink.negativePanelId === panelId),
		 }
		 },
		 isPanelLinkExisting(panelId: string, polarity: Polarity) {
		 return !!allPanelLinks().find(
		 (panelLink) =>
		 (panelLink.positivePanelId === panelId && polarity === 'positive') ||
		 (panelLink.negativePanelId === panelId && polarity === 'negative'),
		 )
		 },
		 loadPanelLinks(panelLinks: PanelLinkModel[]) {
		 store.dispatch(PanelLinksActions.loadPanelLinks({ panelLinks }))
		 },

		 /!*		panelLinksForSelectedString() {
		 return store.selectSignal(selectPanelLinksForSelectedString)()
		 },*!/
		 startPanelLink(panelLinkRequest: PanelLinkRequest) {
		 store.dispatch(PanelLinksActions.startPanelLink({ panelLinkRequest }))
		 },
		 endPanelLink() {
		 store.dispatch(PanelLinksActions.endPanelLink())
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
		 setHoveringOverPanelInLinkMenuId(panelId: string) {
		 store.dispatch(PanelLinksActions.setHoveringOverPanelInLinkMenuId({ panelId }))
		 },
		 clearHoveringOverPanelInLinkMenuId() {
		 store.dispatch(PanelLinksActions.clearHoveringOverPanelInLinkMenuId())
		 },
		 setHoveringOverPanelLinkInLinkMenu(
		 hoveringOverPanelLink: NonNullable<PanelLinksState['hoveringOverPanelLinkInLinkMenu']>,
		 ) {
		 store.dispatch(
		 PanelLinksActions.setHoveringOverPanelLinkInLinkMenu({
		 hoveringOverPanelLink,
		 }),
		 )
		 },
		 clearHoveringOverPanelLinkInLinkMenu() {
		 store.dispatch(PanelLinksActions.clearHoveringOverPanelLinkInLinkMenu())
		 },
		 setSelectedStringLinkCircuit(selectedStringCircuit: StringCircuitWithIndex) {
		 store.dispatch(
		 PanelLinksActions.setSelectedStringCircuit({
		 selectedStringCircuit,
		 }),
		 )
		 },
		 clearSelectedStringLinkCircuit() {
		 store.dispatch(PanelLinksActions.clearSelectedStringCircuit())
		 },
		 setHoveringOverPanelLinkInApp(panelLinkId: string) {
		 store.dispatch(
		 PanelLinksActions.setHoveringOverPanelLinkInApp({
		 panelLinkId,
		 }),
		 )
		 },
		 clearHoveringOverPanelLinkInApp() {
		 store.dispatch(PanelLinksActions.clearHoveringOverPanelLinkInApp())
		 },
		 setHoveringOverPanelPolaritySymbol(panelSymbol: PanelSymbol) {
		 store.dispatch(PanelLinksActions.setHoveringOverPanelPolaritySymbol({ panelSymbol }))
		 },
		 clearHoveringOverPanelPolaritySymbol() {
		 store.dispatch(PanelLinksActions.clearHoveringOverPanelPolaritySymbol())
		 },
		 setMouseDownOnPanelPolaritySymbol(panelSymbol: PanelSymbol) {
		 store.dispatch(PanelLinksActions.setMouseDownOnPanelPolaritySymbol({ panelSymbol }))
		 },
		 clearMouseDownOnPanelPolaritySymbol() {
		 store.dispatch(PanelLinksActions.clearMouseDownOnPanelPolaritySymbol())
		 },
		 setDrawingPanelPolaritySymbolLine(panelSymbol: PanelSymbol) {
		 store.dispatch(PanelLinksActions.setDrawingPanelPolaritySymbolLine({ panelSymbol }))
		 },
		 clearDrawingPanelPolaritySymbolLine() {
		 store.dispatch(PanelLinksActions.clearDrawingPanelPolaritySymbolLine())
		 } /!*		setSelectedLinkModePanelId(panelId: PanelId) {
		 store.dispatch(PanelLinksActions.setSelectedLinkModePanelId({ panelId }))
		 },
		 clearSelectedLinkModePanelId() {
		 store.dispatch(PanelLinksActions.clearSelectedLinkModePanelId())
		 },*!/,

		 clearPanelLinksState() {
		 store.dispatch(PanelLinksActions.clearPanelLinksState())
		 },*/,
	}
}
