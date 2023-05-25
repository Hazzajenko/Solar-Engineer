import { CanvasElementService, injectAppStateStore, PointerState } from '@canvas/app/data-access'
import { inject, Injectable, signal } from '@angular/core'
import { injectPanelLinksStore } from '../store'
import {
	ClosedCircuitChain,
	getEnderPolarityFromDirection,
	getStarterPolarityFromDirection,
	OpenCircuitChain,
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelModel,
	PanelSymbol,
	PolarityDirection,
	StringCircuitChains,
	UndefinedStringId,
} from '@entities/shared'
import { assertNotNull, newGuid, selectSignalFromStore } from '@shared/utils'
import { injectSelectedStore, selectSelectedStringId } from '@canvas/selected/data-access'
import { EntityStoreService } from '../../shared'
import { TransformedPoint } from '@shared/data-access/models'
import {
	changeCanvasCursor,
	isPointInsideMiddleRightOfEntityWithRotationV2,
	isPointInsidePanelSymbols,
	isPointInsidePanelSymbolsV2,
	isPointInsideStretchedEntityByValue,
	setCanvasCursorToAuto,
} from '@canvas/utils'
import {
	calculateLinkLinesBetweenTwoPanelCenters,
	createPanelLink,
	panelWithSymbolToPanelSymbol,
} from '@entities/utils'
import { isPointOverCurvedLineNoCtx } from './utils'
import { CurvedNumberLine } from '@canvas/shared'
import { RenderService } from '@canvas/rendering/data-access'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksService {
	private _entities = inject(EntityStoreService)
	private _appState = injectAppStateStore()
	private _panelLinksStore = injectPanelLinksStore()
	private _render = inject(RenderService)
	// private _panelLinksStore = inject(PanelLinksStoreService)
	private _selectedStore = injectSelectedStore()
	private _canvasElementStore = inject(CanvasElementService)
	// private _render = inject(RenderService)
	// private _selectedId = this._store.selectSignal(selectSelectedStringId)
	// private _selectedStringId = selectSignalFromStore((state) => state.selected.selectedStringId)
	private _selectedStringId = selectSignalFromStore(selectSelectedStringId)
	/*	private _selectedStringLinkPaths = computed(() => {
	 const stringId = this._selectedStringId()
	 if (!stringId) {
	 return []
	 }
	 console.log('PanelLinksService: selectedStringId', stringId)
	 const panelLinks = this._panelLinksStore.getByStringId(stringId)
	 return preparePanelLinksForRender(panelLinks)
	 })*/
	private _selectedStringLinkPaths = signal<number[][]>([])
	// private _selectedStringLinkLines: CurvedNumberLine[][] = []
	private _selectedStringLinkToLinesTuple = signal<[PanelLinkId, CurvedNumberLine][][]>([])
	// private _selectedStringFlatLines = signal<[PanelLinkId, CurvedNumberLine][][]>([])
	// private _selectedStringFlatLines = signal<CurvedNumberLine[][]>([])
	private _selectedStringPanelLinks = signal<PanelLinkModel[]>([])
	// private _selectedStringFlatLines = signal<CurvedNumberLine[]>([])
	// private _selectedStringLinkLines = signal<CurvedNumberLine[][]>([])
	// private _selectedStringMicroLinePoints = signal<APoint[][][]>([])
	private _selectedStringCircuitChains = signal<StringCircuitChains>({
		openCircuitChains: [],
		closedCircuitChains: [],
	})
	private _selectedStringLinkPathToPointMap = signal<Map<string, TransformedPoint>>(new Map())
	/*	private _selectedStringIdV3 = selectSignalFromKnownStore<SelectedState, string | undefined>(
	 (state) => state.selectedStringId,
	 )
	 private _selectedStringIdV4 = selectSignalFromKnownStore(selectSelectedStringId)*/

	polarityDirection: PolarityDirection = 'positive-to-negative'

	/*	constructor() {
	 /!*		effect(() => {
	 const selectedStringId = this._selectedStringId()
	 if (selectedStringId) {
	 console.log('PanelLinksService: selectedStringId', selectedStringId)
	 const panelLinks = this._panelLinksStore.getByStringId(selectedStringId)
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
	 const panelLinks = this._panelLinksStore.getByStringId(selectedStringId)
	 this._selectedStringPanelLinks.set(panelLinks)
	 const stringCircuitChains = prepareStringPanelLinkCircuitChain(
	 panelLinks,
	 ) as StringCircuitChains
	 this._selectedStringCircuitChains.set(stringCircuitChains)
	 const stringCircuitChain = preparePanelLinksForRender(stringCircuitChains)
	 this._selectedStringLinkToLinesTuple.set(stringCircuitChain)
	 }*/

	getPanelLinkOrderIfStringIsSelected() {
		const stringId = this._selectedStore.selectedStringId
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
	}

	handlePanelLinksClick(event: PointerEvent, panel: PanelModel) {
		if (!this._selectedStore.selectedStringId) {
			console.error('a string must be selected to link panels')
			return
		}
		if (panel.stringId === UndefinedStringId) {
			console.error('panel must be in a string to link it')
			return
		}
		const requestingLink = this._panelLinksStore.requestingLink
		if (requestingLink) {
			this.endPanelLink(event, panel, requestingLink)
			return
		}
		this.startPanelLink(event, panel)
	}

	startPanelLink(event: PointerEvent, panel: PanelModel) {
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
		if (this._panelLinksStore.isPanelLinkExisting(panel.id, polarity)) {
			console.error('panel already has a negative link')
			return
		}
		const requestingPanel = this._entities.panels.getById(requestingLink.panelId)
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
		this._panelLinksStore.addPanelLink(panelLink)
		if (event.shiftKey) {
			this.startPanelLink(event, panel)
		} else {
			this._panelLinksStore.endPanelLink()
		}
	}

	getPanelLinkOrderForString(stringId: string) {
		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		return getPanelLinkOrderSeparateChains(panelLinks)
	}

	clearPanelLinkRequest() {
		this._panelLinksStore.endPanelLink()
	}

	isMouseOverLinkPath(event: PointerEvent, currentPoint: TransformedPoint) {
		if (!this._selectedStore.selectedStringId) {
			console.error('a string must be selected to be in link mode')
			return
		}

		const panelLinks = this._entities.panelLinks.getByStringId(this._selectedStore.selectedStringId)
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
		const panelLink = this.isMouseOverLinkPath(event, currentPoint)
		if (!panelLink) {
			if (this._panelLinksStore.requestingLink) {
				this.clearPanelLinkRequest()
			}
			if (this._selectedStore.state.selectedPanelLinkId) {
				this._selectedStore.clearPanelLink()
			}
			return
		}

		this._selectedStore.selectPanelLink(panelLink.id)

		// todo continue this
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

	handleLinkMouseDown(event: PointerEvent, currentPoint: TransformedPoint) {
		const panelWithSymbol = this._entities.panels.getPanelWithSymbolUnderMouse(currentPoint)
		if (!panelWithSymbol) {
			return
		}

		const panelSymbol = panelWithSymbolToPanelSymbol(panelWithSymbol)
		this._entities.panelLinks.setMouseDownOnPanelPolaritySymbol(panelSymbol)
		/*		const symbolUnderMouse = this.getPanelSymbolUnderMouse(currentPoint)
		 if (symbolUnderMouse) {
		 const { panelId, symbol } = symbolUnderMouse
		 this._entities.panelLinks.setMouseDownOnPanelPolaritySymbol(panelId, symbol)
		 // this._selectedStore.selectPanelLink(symbolUnderMouse.id)
		 } else {
		 const panelUnderMouse = this._entities.panels.getEntityUnderMouse(currentPoint)
		 if (!panelUnderMouse) {
		 return
		 }
		 }*/
		/*		if (!symbolUnderMouse) {
		 return
		 }
		 this._selectedStore.selectPanelLink(symbolUnderMouse.id)*/
	}

	handleLinkModeMouseMove(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		pointer: PointerState, // pointer,
	) {
		const drawingPanelPolaritySymbolLine = this._entities.panelLinks.drawingPanelPolaritySymbolLine
		const panelWithSymbol = this._entities.panels.getPanelWithSymbolUnderMouse(currentPoint)
		if (panelWithSymbol) {
			const existingHoveringSymbol = this._entities.panelLinks.getHoveringOverPanelPolaritySymbol
			if (existingHoveringSymbol && existingHoveringSymbol.panelId === panelWithSymbol.id) {
				if (!drawingPanelPolaritySymbolLine) return
				const anyPanelNearby = this._entities.panels.getNearbyPanelInLinkModeExcludingOne(
					currentPoint,
					drawingPanelPolaritySymbolLine.panelId,
				)
				this._render.renderCanvasApp({
					draggingSymbolLinkLine: {
						mouseDownPanelSymbol: drawingPanelPolaritySymbolLine,
						transformedPoint: currentPoint,
						nearbyPanelToLinkLine: anyPanelNearby,
					},
				})
				return
			}
			this._entities.panelLinks.setHoveringOverPanelPolaritySymbol({
				panelId: panelWithSymbol.id,
				symbol: panelWithSymbol.symbol,
			})
			if (drawingPanelPolaritySymbolLine) {
				const anyPanelNearby = this._entities.panels.getNearbyPanelInLinkModeExcludingOne(
					currentPoint,
					drawingPanelPolaritySymbolLine.panelId,
				)

				this._render.renderCanvasApp({
					draggingSymbolLinkLine: {
						mouseDownPanelSymbol: drawingPanelPolaritySymbolLine,
						transformedPoint: currentPoint,
						nearbyPanelToLinkLine: anyPanelNearby,
					},
				})
				return
			}
			this._render.renderCanvasApp()
			return
		} else if (this._entities.panelLinks.getHoveringOverPanelPolaritySymbol) {
			this._entities.panelLinks.clearHoveringOverPanelPolaritySymbol()
			return
		}

		if (drawingPanelPolaritySymbolLine) {
			const anyPanelNearby = this._entities.panels.getNearbyPanelInLinkModeExcludingOne(
				currentPoint,
				drawingPanelPolaritySymbolLine.panelId,
			)

			if (anyPanelNearby) {
				console.log('anyPanelNearby', anyPanelNearby)
			}

			this._render.renderCanvasApp({
				draggingSymbolLinkLine: {
					mouseDownPanelSymbol: drawingPanelPolaritySymbolLine,
					transformedPoint: currentPoint,
					nearbyPanelToLinkLine: anyPanelNearby,
				},
			})
			return
		}

		const panelUnderMouse = this._entities.panels.getPanelUnderMouse(currentPoint)
		if (panelUnderMouse) {
			const hoveringEntityId = pointer.hoveringOverEntityId
			if (hoveringEntityId === panelUnderMouse.id) return
			this._appState.setHoveringOverEntityState(panelUnderMouse.id)
			if (this._entities.panelLinks.getHoveringOverPanelLinkInApp) {
				this._entities.panelLinks.clearHoveringOverPanelLinkInApp()
			}
			return
		}

		const panelLinkUnderMouse = this.isMouseOverLinkPath(event, currentPoint)
		if (panelLinkUnderMouse) {
			const existingPanelLinkUnderMouse = this._entities.panelLinks.getHoveringOverPanelLinkInApp
			if (existingPanelLinkUnderMouse && existingPanelLinkUnderMouse.id === panelLinkUnderMouse.id)
				return
			this._entities.panelLinks.setHoveringOverPanelLinkInApp(panelLinkUnderMouse.id)
			this._render.renderCanvasApp({
				transformedPoint: currentPoint,
			})
			return
		}

		if (this._entities.panelLinks.getHoveringOverPanelLinkInApp) {
			this._entities.panelLinks.clearHoveringOverPanelLinkInApp()
			this._render.renderCanvasApp()
		}

		const entityUnderMouse = this._entities.panels.getPanelUnderMouse(currentPoint)
		if (entityUnderMouse) {
			const hoveringEntityId = pointer.hoveringOverEntityId
			if (hoveringEntityId === entityUnderMouse.id) return
			this._appState.setHoveringOverEntityState(entityUnderMouse.id)
			this._render.renderCanvasApp({
				panelUnderMouse: entityUnderMouse as PanelModel,
			})
			return
		}

		if (pointer.hoverState === 'HoveringOverEntity') {
			// changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
			this._appState.liftHoveringOverEntity()
			this._render.renderCanvasApp()
			return
		}

		return
	}

	handleMouseUpFromPanelPolaritySymbol(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		mouseDownOnPanelPolaritySymbol: PanelSymbol,
	) {
		this._entities.panelLinks.clearDrawingPanelPolaritySymbolLine()
		// this._entities.panelLinks.clearMouseDownOnPanelPolaritySymbol()
		const panelWithSymbolUnderMouse =
			this._entities.panels.getPanelWithSymbolUnderMouse(currentPoint)
		if (!panelWithSymbolUnderMouse) {
			// this._entities.panelLinks.clearMouseDownOnPanelPolaritySymbol()
			return
		}

		if (mouseDownOnPanelPolaritySymbol.panelId === panelWithSymbolUnderMouse.id) {
			// this._entities.panelLinks.clearMouseDownOnPanelPolaritySymbol()
			return
		}

		const mouseDownPanel = this._entities.panels.getById(mouseDownOnPanelPolaritySymbol.panelId)
		assertNotNull(mouseDownPanel)

		const selectedStringId = this._selectedStore.selectedStringId
		assertNotNull(selectedStringId)

		if (mouseDownOnPanelPolaritySymbol.symbol === panelWithSymbolUnderMouse.symbol) {
			console.error('cannot link to same polarity')
			// this._entities.panelLinks.clearMouseDownOnPanelPolaritySymbol()
			return
		}

		const positivePanel =
			panelWithSymbolUnderMouse.symbol === 'positive' ? panelWithSymbolUnderMouse : mouseDownPanel
		const negativePanel =
			panelWithSymbolUnderMouse.symbol === 'negative' ? panelWithSymbolUnderMouse : mouseDownPanel

		const panelLink = createPanelLink(selectedStringId, {
			positivePanel,
			negativePanel,
		})
		this._entities.panelLinks.addPanelLink(panelLink)
	}

	handleLinkMouseMove(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		mouseDownOnPanelPolaritySymbol: PanelSymbol,
	) {
		// this._re
	}

	private getPanelSymbolUnderMouse(point: TransformedPoint) {
		const entitiesUnderMouse = this._entities.panels.allPanels.filter((entity) =>
			isPointInsideStretchedEntityByValue(point, entity, 5),
		)
		if (entitiesUnderMouse.length === 0) return undefined
		const polaritySymbol = entitiesUnderMouse.find((entity) =>
			isPointInsidePanelSymbols(point, entity),
		)
		if (polaritySymbol) return isPointInsidePanelSymbolsV2(point, polaritySymbol)
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
