import { AppStateStoreService, CanvasElementService } from '@canvas/app/data-access'
import { inject, Injectable, signal } from '@angular/core'
import { PanelLinksStoreService } from '../store'
import {
	CanvasPanel,
	ClosedCircuitChain,
	getEnderPolarityFromDirection,
	getStarterPolarityFromDirection,
	OpenCircuitChain,
	PanelLinkModel,
	PanelLinkRequest,
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
	isPointOnLine,
	setCanvasCursorToAuto,
} from '@canvas/utils'
import { calculateLinkLinesBetweenTwoPanelCenters } from '@entities/utils'
import {
	panelLinksToNumberArray,
	preparePanelLinksForRender,
	prepareStringPanelLinkCircuitChain,
} from './utils'
import {
	isPointOnCurvedPath,
	isPointOnCurvedPathV4,
} from '../../../../../../canvas/rendering/data-access/src/lib/services/render/render-fns/links/deprecated/draw-splines-rework'
import { CurvedNumberLine } from '@canvas/shared'

@Injectable({
	providedIn: 'root',
})
export class PanelLinksService {
	private _entities = inject(EntityStoreService)
	private _appStore = inject(AppStateStoreService)
	private _panelLinksStore = inject(PanelLinksStoreService)
	private _selectedStore = injectSelectedStore()
	private _canvasElementStore = inject(CanvasElementService)
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
	private _selectedStringLinkLines = signal<CurvedNumberLine[][]>([])
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

	constructor() {
		/*		effect(() => {
		 const selectedStringId = this._selectedStringId()
		 if (selectedStringId) {
		 console.log('PanelLinksService: selectedStringId', selectedStringId)
		 const panelLinks = this._panelLinksStore.getByStringId(selectedStringId)
		 const curvedLines = preparePanelLinksForRender(panelLinks)
		 console.log('PanelLinksService: curvedLines', curvedLines)
		 this._selectedStringLinkLines = curvedLines
		 // this._selectedStringLinkLines.set(curvedLines)
		 }
		 })*/
	}

	updateSelectedStringLinkLines() {
		const selectedStringId = this._selectedStringId()
		if (!selectedStringId) {
			return
		}
		const panelLinks = this._panelLinksStore.getByStringId(selectedStringId)
		const stringCircuitChains = prepareStringPanelLinkCircuitChain(panelLinks)
		this._selectedStringCircuitChains.set(stringCircuitChains)
		const stringCircuitCurvedLines = preparePanelLinksForRender(stringCircuitChains)
		this._selectedStringLinkLines.set(stringCircuitCurvedLines)
	}

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
			id: newGuid(),
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

	getPanelLinkOrderForSelectedStringV2() {
		const stringId = this._selectedStore.selectedStringId
		assertNotNull(stringId)
		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		return getPanelLinkOrderSeparateChains(panelLinks)
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

	getPanelLinkOrderIfStringIsSelected() {
		const stringId = this._selectedStore.selectedStringId
		if (!stringId) {
			return {
				openCircuitChains: [] as OpenCircuitChain[],
				closedCircuitChains: [] as ClosedCircuitChain[],
				circuitCurvedLines: [] as CurvedNumberLine[][],
			}
		}
		const { openCircuitChains, closedCircuitChains } = this._selectedStringCircuitChains()
		const circuitCurvedLines = this._selectedStringLinkLines()
		return {
			openCircuitChains,
			closedCircuitChains,
			circuitCurvedLines,
		}
		/*		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		 const circuitChains = getPanelLinkOrderSeparateChainsV2(panelLinks) as {
		 openCircuitChains: OpenCircuitChain[]
		 closedCircuitChains: ClosedCircuitChain[]
		 }

		 const openCircuitChains = circuitChains.openCircuitChains.map((chain) => sortPanelLinks(chain))
		 const closedCircuitChains = circuitChains.closedCircuitChains.map((chain) =>
		 sortPanelLinks(chain),
		 )
		 return {
		 openCircuitChains,
		 closedCircuitChains,
		 }*/
	}

	getPanelLinkOrderForSelectedStringWithPoints() {
		const stringId = this._selectedStore.selectedStringId
		assertNotNull(stringId)
		const panelLinks = this._panelLinksStore.getByStringId(stringId)
		return panelLinks.sort((a, b) => {
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

	isMouseOverLinkPathV3(
		event: PointerEvent,
		currentPoint: TransformedPoint,
		ctx: CanvasRenderingContext2D,
	) {
		if (!this._selectedStore.selectedStringId) {
			console.error('a string must be selected to be in link mode')
			return
		}

		const panelLinks = this._entities.panelLinks.getByStringId(this._selectedStore.selectedStringId)
		if (!panelLinks.length) {
			return
		}

		const selectedStringPanelLinks = this.getPanelLinkOrderForSelectedStringWithPoints()
		const linkPathNumberArray = panelLinksToNumberArray(selectedStringPanelLinks)
		const isPointOnPath = isPointOnCurvedPath(ctx, currentPoint, linkPathNumberArray)
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

		const selectedStringPanelLinks = this.getPanelLinkOrderForSelectedStringWithPoints()
		const linkPathNumberArray = panelLinksToNumberArray(selectedStringPanelLinks)
		// const isPointOnPath = isPointOnCurvedPath(currentPoint, linkPathNumberArray)
		const isPointOnPath = isPointOnCurvedPathV4(currentPoint)
		// const isPointOnPath = isPointOnCurvedPathV3(currentPoint)
		console.log('panelLink', isPointOnPath)
		// const isPointOnPath = isPointOnCurvedPathV2(currentPoint)
		// const isPointOnPath = isPointOnCurvedPath(currentPoint, linkPathNumberArray)
		// console.log('panelLink', isPointOnPath)

		const panelLink = panelLinks.find((panelLink) => {
			return isPointOnLine(currentPoint, panelLink.linePoints)
		})

		if (!panelLink) {
			setCanvasCursorToAuto(this._canvasElementStore.canvas)
			return
		}

		if (this._canvasElementStore.canvas.style.cursor !== 'pointer') {
			changeCanvasCursor(this._canvasElementStore.canvas, 'pointer')
		}

		// console.log('panelLink', panelLink)
		return panelLink
	}

	handleLinkModeClickOnCanvas(event: PointerEvent, currentPoint: TransformedPoint) {
		/*		if (!this._selectedStore.selectedStringId) {
		 console.error('a string must be selected to be in link mode')
		 return
		 }*/

		const panelLink = this.isMouseOverLinkPath(event, currentPoint)
		if (!panelLink) {
			if (this._panelLinksStore.state.requestingLink) {
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
