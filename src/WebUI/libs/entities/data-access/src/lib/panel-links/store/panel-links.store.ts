import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import {
	selectAllPanelLinks,
	selectPanelLinksEntities,
	selectPanelLinksState,
} from './panel-links.selectors'
import { isNotNull } from '@shared/utils'
import { PanelLinksActions } from './panel-links.actions'
import { UpdateStr } from '@ngrx/entity/src/models'
import { PanelLinkModel, Polarity } from '@entities/shared'

export function injectPanelLinksStore() {
	const store = inject(Store)
	const state = store.selectSignal(selectPanelLinksState)
	const allPanelLinks = store.selectSignal(selectAllPanelLinks)
	const entities = store.selectSignal(selectPanelLinksEntities)

	return {
		get allPanelLinks() {
			return allPanelLinks()
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
		clearPanelLinksState() {
			store.dispatch(PanelLinksActions.clearPanelLinksState())
		},
	}
}

export type PanelLinksStore = ReturnType<typeof injectPanelLinksStore>
