import { CanvasElementService, injectAppStateStore, PointerState } from '@canvas/app/data-access'
import { inject, Injectable } from '@angular/core'
import { injectPanelLinksStore } from '../store'
import {
	getEnderPolarityFromDirection,
	getStarterPolarityFromDirection,
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelModel,
	PolarityDirection,
	StringId,
	UNDEFINED_STRING_ID,
} from '@entities/shared'
import { assertNotNull, newGuid } from '@shared/utils'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { TransformedPoint } from '@shared/data-access/models'
import { changeCanvasCursor, setCanvasCursorToAuto } from '@canvas/utils'
import {
	calculateLinkLinesBetweenTwoPanelCenters,
	getPanelLinkOrderSeparateChains,
} from '@entities/utils'
import { isPointOverCurvedLineNoCtx } from './utils'
import { CanvasRenderOptions } from '@canvas/rendering/data-access'
import { injectEntityStore } from '../../shared'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksService {
	private _entities = injectEntityStore()
	private _appStore = injectAppStateStore()
	private _panelLinksStore = injectPanelLinksStore()
	private _selectedStore = injectSelectedStore()
	private _canvasElementStore = inject(CanvasElementService)

	polarityDirection: PolarityDirection = 'positive-to-negative'

	handlePanelLinksClick(panel: PanelModel, shiftKey = false) {
		if (!this._selectedStore.select.selectedStringId()) {
			console.error('a string must be selected to link panels')
			return
		}
		if (panel.stringId === UNDEFINED_STRING_ID) {
			console.error('panel must be in a string to link it')
			return
		}
		const requestingLink = this._panelLinksStore.select.requestingLink()
		if (requestingLink) {
			this.endPanelLink(panel, requestingLink, shiftKey)
			return
		}
		this.startPanelLink(panel)
	}

	startPanelLink(panel: PanelModel) {
		const polarity = getStarterPolarityFromDirection(this.polarityDirection)
		if (this._panelLinksStore.select.isPanelLinkExisting(panel.id, polarity)) {
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

	endPanelLink(panel: PanelModel, requestingLink: PanelLinkRequest, shiftKey = false) {
		if (requestingLink.stringId !== panel.stringId) {
			console.error(
				'panels need to be in the same string to link them, requestingLink.stringId !== panel.stringId',
			)
			return
		}
		const polarity = getEnderPolarityFromDirection(this.polarityDirection)
		if (this._panelLinksStore.select.isPanelLinkExisting(panel.id, polarity)) {
			console.error('panel already has a negative link')
			return
		}
		const requestingPanel = this._entities.panels.select.getById(requestingLink.panelId)
		if (!requestingPanel) {
			console.error('requestingPanel not found')
			return
		}
		const panelLink: PanelLinkModel = {
			id: newGuid() as PanelLinkId,
			stringId: panel.stringId,
			positivePanelId:
				requestingLink.direction === 'positive-to-negative' ? requestingLink.panelId : panel.id,
			negativePanelId:
				requestingLink.direction === 'positive-to-negative' ? panel.id : requestingLink.panelId,
			linePoints: calculateLinkLinesBetweenTwoPanelCenters(requestingPanel, panel),
		}
		this._panelLinksStore.dispatch.addPanelLink(panelLink)
		if (shiftKey) {
			this.startPanelLink(panel)
		} else {
			this._panelLinksStore.dispatch.endPanelLink()
		}
	}

	getPanelLinkOrderForString(stringId: StringId) {
		const panelLinks = this._panelLinksStore.select.getByStringId(stringId)
		return getPanelLinkOrderSeparateChains(panelLinks)
	}

	clearPanelLinkRequest() {
		this._panelLinksStore.dispatch.endPanelLink()
	}

	isMouseOverLinkPath(event: PointerEvent, currentPoint: TransformedPoint) {
		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (!selectedStringId) {
			console.error('a string must be selected to be in link mode')
			return
		}

		const panelLinks = this._entities.panelLinks.select.getByStringId(selectedStringId)
		if (!panelLinks.length) {
			return
		}
		const panelLinkIdPointsTuple = this._panelLinksStore.select.selectedStringCircuitLinkLines()
		assertNotNull(panelLinkIdPointsTuple)

		const panelLinkIdForPoint = isPointOverCurvedLineNoCtx(panelLinkIdPointsTuple, currentPoint)

		if (!panelLinkIdForPoint) {
			setCanvasCursorToAuto(this._canvasElementStore.canvas)
			return
		}

		const panelLink = panelLinks.find((panelLink) => panelLink.id === panelLinkIdForPoint)
		assertNotNull(panelLink)

		if (this._canvasElementStore.canvas.style.cursor !== 'pointer') {
			changeCanvasCursor(this._canvasElementStore.canvas, 'pointer')
		}

		return panelLink
	}

	handleLinkModeClickOnCanvas(event: PointerEvent, currentPoint: TransformedPoint) {
		const panelLinkRequest = this._panelLinksStore.select.requestingLink()
		if (panelLinkRequest) {
			const nearbyPanelToLinkLine =
				this._entities.panels.select.getNearbyPanelInLinkModeExcludingOne(
					currentPoint,
					panelLinkRequest.panelId,
				)
			if (nearbyPanelToLinkLine) {
				this.endPanelLink(nearbyPanelToLinkLine, panelLinkRequest, event.shiftKey)
				return
			}
		}

		const panelLink = this.isMouseOverLinkPath(event, currentPoint)
		if (!panelLink) {
			if (this._panelLinksStore.select.requestingLink()) {
				this.clearPanelLinkRequest()
			}
			if (this._selectedStore.select.selectedPanelLinkId()) {
				this._selectedStore.dispatch.clearSelectedPanelLink()
			}
			return
		}

		this._selectedStore.dispatch.selectPanelLink(panelLink.id)

		// todo continue this
	}

	handleLinkModeMouseMove(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		pointer: PointerState,
	): Partial<CanvasRenderOptions> | undefined {
		const panelLinkRequest = this._panelLinksStore.select.requestingLink()
		if (panelLinkRequest) {
			const panel = this._entities.panels.select.getById(panelLinkRequest.panelId)
			assertNotNull(panel)
			const nearbyPanelToLinkLine =
				this._entities.panels.select.getNearbyPanelInLinkModeExcludingOne(
					currentPoint,
					panelLinkRequest.panelId,
				)
			return {
				panelLinkRequest: {
					request: panelLinkRequest,
					currentPoint,
					panel,
					nearbyPanelToLinkLine,
				},
			}
		}

		const panelUnderMouse = this._entities.panels.select.getPanelUnderMouse(currentPoint)
		if (panelUnderMouse) {
			const hoveringEntityId = pointer.hoveringOverPanelId
			if (hoveringEntityId === panelUnderMouse.id) return
			this._appStore.dispatch.setHoveringOverEntityState(panelUnderMouse.id)
			if (this._entities.panelLinks.select.hoveringOverPanelLinkInApp()) {
				this._entities.panelLinks.dispatch.clearHoveringOverPanelLinkInApp()
			}
			return
		}

		const panelLinkUnderMouse = this.isMouseOverLinkPath(event, currentPoint)
		if (panelLinkUnderMouse) {
			const existingPanelLinkUnderMouse =
				this._entities.panelLinks.select.hoveringOverPanelLinkInApp()
			if (existingPanelLinkUnderMouse && existingPanelLinkUnderMouse.id === panelLinkUnderMouse.id)
				return
			this._entities.panelLinks.dispatch.setHoveringOverPanelLinkInApp(panelLinkUnderMouse.id)
			return {
				transformedPoint: currentPoint,
			}
		}

		if (this._entities.panelLinks.select.hoveringOverPanelLinkInApp()) {
			this._entities.panelLinks.dispatch.clearHoveringOverPanelLinkInApp()
			return {}
		}

		const entityUnderMouse = this._entities.panels.select.getPanelUnderMouse(currentPoint)
		if (entityUnderMouse) {
			console.log('entity under mouse', entityUnderMouse)
			const hoveringEntityId = pointer.hoveringOverPanelId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._appStore.dispatch.setHoveringOverEntityState(entityUnderMouse.id)
			return {
				panelUnderMouse: entityUnderMouse as PanelModel,
			}
		}

		if (pointer.hoverState === 'HoveringOverEntity') {
			this._appStore.dispatch.liftHoveringOverEntity()
			return {}
		}

		return
	}
}
