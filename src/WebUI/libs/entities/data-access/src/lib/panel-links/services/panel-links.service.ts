import { CanvasElementService, injectAppStateStore, PointerState } from '@canvas/app/data-access'
import { inject, Injectable, signal } from '@angular/core'
import { injectPanelLinksStore } from '../store'
import {
	getEnderPolarityFromDirection,
	getStarterPolarityFromDirection,
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelModel,
	PolarityDirection,
	StringCircuitChains,
	StringId,
	UNDEFINED_STRING_ID,
} from '@entities/shared'
import { assertNotNull, newGuid, selectSignalFromStore } from '@shared/utils'
import { injectSelectedStore, selectSelectedStringId } from '@canvas/selected/data-access'
import { TransformedPoint } from '@shared/data-access/models'
import { changeCanvasCursor, setCanvasCursorToAuto } from '@canvas/utils'
import { calculateLinkLinesBetweenTwoPanelCenters } from '@entities/utils'
import { isPointOverCurvedLineNoCtx } from './utils'
import { CurvedNumberLine } from '@canvas/shared'
import { CanvasRenderOptions } from '@canvas/rendering/data-access'
import { injectEntityStore } from '../../shared'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksService {
	private _entities = injectEntityStore()
	private _appState = injectAppStateStore()
	private _panelLinksStore = injectPanelLinksStore()
	private _selectedStore = injectSelectedStore()
	private _canvasElementStore = inject(CanvasElementService)
	private _selectedStringId = selectSignalFromStore(selectSelectedStringId)
	private _selectedStringLinkPaths = signal<number[][]>([])
	private _selectedStringLinkToLinesTuple = signal<[PanelLinkId, CurvedNumberLine][][]>([])
	private _selectedStringPanelLinks = signal<PanelLinkModel[]>([])
	private _selectedStringCircuitChains = signal<StringCircuitChains>({
		openCircuitChains: [],
		closedCircuitChains: [],
	})
	private _selectedStringLinkPathToPointMap = signal<Map<string, TransformedPoint>>(new Map())

	polarityDirection: PolarityDirection = 'positive-to-negative'

	/*	constructor() {
	 /!*		effect(() => {
	 const selectedStringId = this._selectedStringId()
	 if (selectedStringId) {
	 console.log('PanelLinksService: selectedStringId', selectedStringId)
	 const panelLinks = this._panelLinksStore.select.getByStringId(selectedStringId)
	 const curvedLines = preparePanelLinksForRender(panelLinks)
	 console.log('PanelLinksService: curvedLines', curvedLines)
	 this._selectedStringLinkLines = curvedLines
	 // this._selectedStringLinkLines.set(curvedLines)
	 }
	 })*!/
	 }*/

	/*	updateSelectedStringLinkLines() {
	 const selectedStringId = this._selectedStringId()
	 if (!selectedStringId) {
	 return
	 }
	 const panelLinks = this._panelLinksStore.select.getByStringId(selectedStringId)
	 this._selectedStringPanelLinks.set(panelLinks)
	 const stringCircuitChains = prepareStringPanelLinkCircuitChain(
	 panelLinks,
	 ) as StringCircuitChains
	 this._selectedStringCircuitChains.set(stringCircuitChains)
	 const stringCircuitChain = preparePanelLinksForRender(stringCircuitChains)
	 this._selectedStringLinkToLinesTuple.set(stringCircuitChain)
	 }*/

	/*	getPanelLinkOrderIfStringIsSelected() {
	 const stringId = this._selectedStore.select.selectedStringId()
	 if (!stringId) {
	 return {
	 stringPanelLinks: [] as PanelLinkModel[],
	 openCircuitChains: [] as OpenCircuitChain[],
	 closedCircuitChains: [] as ClosedCircuitChain[],
	 circuitLinkLineTuples: [] as [PanelLinkId, CurvedNumberLine][][],
	 }
	 }
	 const stringPanelLinks = this._selectedStringPanelLinks()
	 const { openCircuitChains, closedCircuitChains } = this._selectedStringCircuitChains()
	 const circuitLinkLineTuples = this._selectedStringLinkToLinesTuple()
	 // const circuitCurvedLines = this._selectedStringFlatLines()
	 return {
	 stringPanelLinks,
	 openCircuitChains,
	 closedCircuitChains, // circuitCurvedLines,
	 circuitLinkLineTuples,
	 }
	 }*/

	handlePanelLinksClick(event: PointerEvent, panel: PanelModel) {
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
			this.endPanelLink(event, panel, requestingLink)
			return
		}
		this.startPanelLink(event, panel)
	}

	startPanelLink(event: PointerEvent, panel: PanelModel) {
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
		// this._panelLinksStore.startPanelLink(panelLinkRequest)
	}

	endPanelLink(event: PointerEvent, panel: PanelModel, requestingLink: PanelLinkRequest) {
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
			linePoints: calculateLinkLinesBetweenTwoPanelCenters(requestingPanel, panel), // linePoints: calculateLinkLinesBetweenTwoPanels(requestingPanel, panel),
		}
		this._panelLinksStore.dispatch.addPanelLink(panelLink)
		if (event.shiftKey) {
			this.startPanelLink(event, panel)
		} else {
			this._panelLinksStore.dispatch.endPanelLink()
		}
	}

	getPanelLinkOrderForSelectedString() {
		const selectedStringId = this._selectedStore.select.selectedStringId()
		if (!selectedStringId) return
		const panelLinks = this._panelLinksStore.select.getByStringId(selectedStringId)
		return getPanelLinkOrderSeparateChains(panelLinks)
	}

	getPanelLinkOrderForString(stringId: StringId) {
		const panelLinks = this._panelLinksStore.select.getByStringId(stringId)
		// const panelLinks = this._panelLinksStore.select.getByStringId(stringId)
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
		const panelLinkIdPointsTuple = this._selectedStringLinkToLinesTuple()
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
		// const panelLinkRequest = this._panelLinksStore.select.requestingLink()
		if (panelLinkRequest) {
			const nearbyPanelToLinkLine =
				this._entities.panels.select.getNearbyPanelInLinkModeExcludingOne(
					currentPoint,
					panelLinkRequest.panelId,
				)
			if (nearbyPanelToLinkLine) {
				this.endPanelLink(event, nearbyPanelToLinkLine, panelLinkRequest)
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
				// this._selectedStore.dispatch.clearSelectedPanelLink()
			}
			return
		}

		this._selectedStore.dispatch.selectPanelLink(panelLink.id)

		// todo continue this
	}

	handleLinkModeMouseMove(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		pointer: PointerState, // pointer,
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

			// return
		}

		const panelUnderMouse = this._entities.panels.select.getPanelUnderMouse(currentPoint)
		if (panelUnderMouse) {
			const hoveringEntityId = pointer.hoveringOverPanelId
			if (hoveringEntityId === panelUnderMouse.id) return
			this._appState.setHoveringOverEntityState(panelUnderMouse.id)
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
			// this._entities.panelLinks.dispatch.setHoveringOverPanelLinkInApp(panelLinkUnderMouse.id)
			return {
				transformedPoint: currentPoint,
			}
			/*			this._render.renderCanvasApp({
			 transformedPoint: currentPoint,
			 })
			 return*/
		}

		if (this._entities.panelLinks.select.hoveringOverPanelLinkInApp()) {
			// if (this._entities.panelLinks.select.hoveringOverPanelLinkInApp()) {
			this._entities.panelLinks.dispatch.clearHoveringOverPanelLinkInApp()
			// this._entities.panelLinks.dispatch.clearHoveringOverPanelLinkInApp()
			// this._render.renderCanvasApp()
			return {}
		}

		const entityUnderMouse = this._entities.panels.select.getPanelUnderMouse(currentPoint)
		if (entityUnderMouse) {
			const hoveringEntityId = pointer.hoveringOverPanelId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._appState.setHoveringOverEntityState(entityUnderMouse.id)
			return {
				panelUnderMouse: entityUnderMouse as PanelModel,
			}
			/*			this._render.renderCanvasApp({
			 panelUnderMouse: entityUnderMouse as PanelModel,
			 })
			 return*/
		}

		if (pointer.hoverState === 'HoveringOverEntity') {
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._appState.liftHoveringOverEntity()
			return {}
			// this._render.renderCanvasApp()
			// return
		}

		return
	}
}

const getPanelLinkOrderSeparateChains = (panelLinks: PanelLinkModel[]) => {
	const positivePanelIds = new Set(panelLinks.map((pl) => pl.positivePanelId))
	const startOfChains = panelLinks.filter(
		(panelLink) => !positivePanelIds.has(panelLink.negativePanelId),
	)

	return startOfChains.map((panelLink) => {
		const panelLinkChain = [panelLink]
		let currentPanelLink = panelLink
		let panelLinkChainOrderInProcess = true
		while (panelLinkChainOrderInProcess) {
			const nextPanelLink = panelLinks.find(
				(pl) => pl.negativePanelId === currentPanelLink.positivePanelId,
			)
			if (!nextPanelLink) {
				panelLinkChainOrderInProcess = false
				return panelLinkChain
			}
			panelLinkChain.push(nextPanelLink)
			currentPanelLink = nextPanelLink
		}
		return panelLinkChain
	})
}
