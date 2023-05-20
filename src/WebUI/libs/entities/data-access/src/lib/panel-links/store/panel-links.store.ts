import { inject, makeEnvironmentProviders } from '@angular/core'
import { provideState, Store } from '@ngrx/store'
import {
	selectAllPanelLinks,
	selectHoveringOverPanelInLinkMenuId,
	selectHoveringOverPanelLinkInLinkMenu,
	selectPanelLinksEntities,
	selectPanelLinksState,
} from './panel-links.selectors'
import { isNotNull } from '@shared/utils'
import { PanelLinksActions } from './panel-links.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { PanelLinkModel, Polarity } from '@entities/shared'
import { PANEL_LINKS_FEATURE_KEY, panelLinksReducer, PanelLinksState } from './panel-links.reducer'
import { provideEffects } from '@ngrx/effects'
import * as panelLinksEffects from './panel-links.effects'

export function providePanelLinksFeature() {
	return makeEnvironmentProviders([
		provideState(PANEL_LINKS_FEATURE_KEY, panelLinksReducer),
		provideEffects(panelLinksEffects),
	])
}

export function injectPanelLinksStore() {
	const store = inject(Store)
	const state = store.selectSignal(selectPanelLinksState)
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
		getByPanelId(panelId: string) {
			return allPanelLinks().filter(
				(panelLink) =>
					panelLink.positivePanelId === panelId || panelLink.negativePanelId === panelId,
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
		} /*		panelLinksForSelectedString() {
		 return store.selectSignal(selectPanelLinksForSelectedString)()
		 },*/,
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
		clearPanelLinksState() {
			store.dispatch(PanelLinksActions.clearPanelLinksState())
		},
	}
}

export type PanelLinksStore = ReturnType<typeof injectPanelLinksStore>
