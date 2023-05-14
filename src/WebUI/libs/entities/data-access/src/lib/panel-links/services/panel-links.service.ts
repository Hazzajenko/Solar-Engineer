import { AppStateStoreService } from '@canvas/app/data-access'
import { inject, Injectable } from '@angular/core'
import { PanelLinksStoreService } from '../store'
import {
	CanvasPanel,
	getStarterPolarityFromDirection,
	PanelLinkModel,
	PanelLinkRequest,
	PolarityDirection,
	UndefinedStringId,
} from '@entities/shared'
import { assertNotNull, newGuid } from '@shared/utils'
import { SelectedStoreService } from '@canvas/selected/data-access'
import { EntityStoreService } from '../../shared'
import { TransformedPoint } from '@shared/data-access/models'
import { isPointInsideMiddleRightOfEntityWithRotationV2, isPointOnLine } from '@canvas/utils'
import { calculateLinkLinesBetweenTwoPanels } from '@entities/utils'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksService {
	private _entities = inject(EntityStoreService)
	// private _entities = inject(EntityStoreService)
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
		this._panelLinksStore.startPanelLink(panelLinkRequest)
	}

	endPanelLink(event: PointerEvent, panel: CanvasPanel, requestingLink: PanelLinkRequest) {
		if (requestingLink.stringId !== panel.stringId) {
			console.error(
				'panels need to be in the same string to link them, requestingLink.stringId !== panel.stringId',
			)
			return
		}
		const requestingPanel = this._entities.panels.getById(requestingLink.panelId)
		if (!requestingPanel) {
			console.error('requestingPanel not found')
			return
		}
		const panelLink: PanelLinkModel = {
			id: newGuid(),
			stringId: panel.stringId,
			positivePanelId:
				requestingLink.direction === 'positive-to-negative' ? requestingLink.panelId : panel.id,
			negativePanelId:
				requestingLink.direction === 'positive-to-negative' ? panel.id : requestingLink.panelId,
			linePoints: calculateLinkLinesBetweenTwoPanels(requestingPanel, panel),
		}
		this._panelLinksStore.addPanelLink(panelLink)
		if (event.shiftKey) {
			this.startPanelLink(event, panel)
		} else {
			this._panelLinksStore.endPanelLink()
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
		this._panelLinksStore.endPanelLink()
	}

	handleMouseInLinkMode(event: PointerEvent, currentPoint: TransformedPoint) {
		this.isMouseOverLinkPath(event, currentPoint)
	}

	isMouseOverLinkPath(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!this._selectedStore.selectedStringId) {
			console.error('a string must be selected to be in link mode')
			return
		}

		const panelLinks = this._entities.panelLinks.getByStringId(this._selectedStore.selectedStringId)
		// const panelLinks = this._entities.panelLinks.panelLinksForSelectedString()
		if (!panelLinks) {
			console.error('panelLinks not found')
			return
		}

		const panelLink = panelLinks.find((panelLink) => {
			return isPointOnLine(currentPoint, panelLink.linePoints)
		})

		if (!panelLink) {
			return
		}

		console.log('panelLink', panelLink)
	}

	isLinkSymbolUnderMouse(event: PointerEvent, currentPoint: TransformedPoint) {
		// const entitiesUnderMouse = this._entities.panels.allPanels.filter((entity) =>
		// 	isPointInsideEntity(currentPoint, entity),
		// )
		const entitiesUnderMouse = this._entities.panels.allPanels.find((entity) =>
			isPointInsideMiddleRightOfEntityWithRotationV2(currentPoint, entity),
		)

		if (!entitiesUnderMouse) {
			return
		}
	}
}
