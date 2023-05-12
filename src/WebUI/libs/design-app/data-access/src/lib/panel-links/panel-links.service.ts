import { AppStateStoreService } from '../app-store'
import { EntityStoreService } from '../entities'
import { inject, Injectable } from '@angular/core'
import { CanvasPanel, UndefinedStringId } from '@design-app/shared'
import { PanelLinksStoreService } from './panel-links-store.service'
import {
	getStarterPolarityFromDirection,
	PanelLinkModel,
	PanelLinkRequest,
	PolarityDirection,
} from './panel-link'
import { assertNotNull, newGuid } from '@shared/utils'
import { SelectedStoreService } from '../selected'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksService {
	private _entities = inject(EntityStoreService)
	private _appStore = inject(AppStateStoreService)
	private _panelLinksStore = inject(PanelLinksStoreService)
	private _selectedStore = inject(SelectedStoreService)

	polarityDirection: PolarityDirection = 'positive-to-negative'

	handlePanelLinksClick(event: PointerEvent, panel: CanvasPanel) {
		if (!this._selectedStore.selectedStringId) {
			console.error('a string must be selected to link panels')
			return
		}
		if (panel.stringId === UndefinedStringId) {
			console.error('panel must be in a string to link it')
			return
		}
		const requestingLink = this._panelLinksStore.state.requestingLink
		if (requestingLink) {
			this.endPanelLink(event, panel, requestingLink)
			return
		}
		this.startPanelLink(event, panel)
	}

	startPanelLink(event: PointerEvent, panel: CanvasPanel) {
		const polarity = getStarterPolarityFromDirection(this.polarityDirection)
		if (this._panelLinksStore.isPanelLinkExisting(panel.id, polarity)) {
			console.error('panel already has a positive link')
			return
		}

		const panelLinkRequest: PanelLinkRequest = {
			direction: this.polarityDirection,
			stringId: panel.stringId,
			panelId: panel.id,
		}
		this._panelLinksStore.dispatch.startPanelLink(panelLinkRequest)
	}

	endPanelLink(event: PointerEvent, panel: CanvasPanel, requestingLink: PanelLinkRequest) {
		if (requestingLink.stringId !== panel.stringId) {
			console.error(
				'panels need to be in the same string to link them, requestingLink.stringId !== panel.stringId',
			)
			return
		}
		const panelLink: PanelLinkModel = {
			id: newGuid(),
			stringId: panel.stringId,
			positivePanelId:
				requestingLink.direction === 'positive-to-negative' ? requestingLink.panelId : panel.id,
			negativePanelId:
				requestingLink.direction === 'positive-to-negative' ? panel.id : requestingLink.panelId,
		}
		this._panelLinksStore.dispatch.addPanelLink(panelLink)
		if (event.shiftKey) {
			this.startPanelLink(event, panel)
		} else {
			this._panelLinksStore.dispatch.endPanelLink()
		}
		this.getPanelLinkOrderForString(panel.stringId)
	}

	getPanelLinkOrderForString(stringId: string) {
		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		const panelLinkOrder = panelLinks.map((panelLink) => {
			const positivePanel = this._entities.panels.getById(panelLink.positivePanelId)
			const negativePanel = this._entities.panels.getById(panelLink.negativePanelId)
			if (!positivePanel || !negativePanel) {
				console.error('getPanelLinkOrderForString: !positivePanel || !negativePanel')
				return undefined
			}
			return {
				positivePanel,
				negativePanel,
			}
		})
		return panelLinkOrder.sort((a, b) => {
			if (!a || !b) {
				return 0
			}
			return a.positivePanel.id === b.negativePanel.id ? 1 : -1
		})
	}

	getPanelLinkOrderForSelectedString() {
		const stringId = this._selectedStore.selectedStringId
		assertNotNull(stringId)
		/*		if (!stringId) {
		 console.error('getPanelLinkOrderForSelectedString: !stringId')
		 return []
		 }*/
		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		return panelLinks
			.map((panelLink) => ({
				positivePanelId: panelLink.positivePanelId,
				negativePanelId: panelLink.negativePanelId,
			}))
			.sort((a, b) => {
				if (!a || !b) {
					return 0
				}
				return a.positivePanelId === b.negativePanelId ? 1 : -1
			})
	}

	clearPanelLinkRequest() {
		this._panelLinksStore.dispatch.endPanelLink()
	}
}
