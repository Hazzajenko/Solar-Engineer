import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import {
	selectAllPanelLinks,
	selectDrawingPanelPolaritySymbolLine,
	selectHoveringOverPanelInLinkMenuId,
	selectHoveringOverPanelLinkInApp,
	selectHoveringOverPanelLinkInLinkMenu,
	selectHoveringOverPanelPolaritySymbol,
	selectMouseDownOnPanelPolaritySymbol,
	selectPanelLinksEntities,
	selectRequestingLink,
	selectSelectedStringCircuit,
} from './panel-links.selectors'
import { isNotNull } from '@shared/utils'
import { PanelLinksActions } from './panel-links.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import {
	PanelLinkModel,
	PanelLinkRequest,
	PanelSymbol,
	Polarity,
	StringCircuit,
} from '@entities/shared'
import { PANEL_LINKS_FEATURE_KEY, panelLinksReducer, PanelLinksState } from './panel-links.reducer'
import * as panelLinksEffects from './panel-links.effects'
import { provideEffects } from '@ngrx/effects'

export function providePanelLinksFeature() {
	return makeEnvironmentProviders([
		provideState(PANEL_LINKS_FEATURE_KEY, panelLinksReducer),
		provideEffects(panelLinksEffects),
	])
}

export function injectPanelLinksStore() {
	const store = inject(Store)
	// const state = store.selectSignal(selectPanelLinksState)
	const allPanelLinks = store.selectSignal(selectAllPanelLinks)
	const entities = store.selectSignal(selectPanelLinksEntities)

	return {
		get allPanelLinks() {
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

		/*		panelLinksForSelectedString() {
		 return store.selectSignal(selectPanelLinksForSelectedString)()
		 },*/
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
		setSelectedStringLinkCircuit(selectedStringCircuit: StringCircuit) {
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
		},
		clearPanelLinksState() {
			store.dispatch(PanelLinksActions.clearPanelLinksState())
		},
	}
}

export type PanelLinksStore = ReturnType<typeof injectPanelLinksStore>
