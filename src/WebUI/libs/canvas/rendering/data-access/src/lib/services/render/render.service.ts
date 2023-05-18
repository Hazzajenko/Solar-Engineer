import {
	AppStateStoreService,
	CanvasElementService,
	DIV_ELEMENT,
	DivElementsService,
	MODE_STATE,
} from '@canvas/app/data-access'
// import { EntityStoreService } from '../entities'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { CanvasRenderOptions } from '../../types'
import {
	drawBoxWithOptionsCtx,
	drawClickNearEntityBounds,
	drawCreationDragBox,
	drawEntityCreationPreview,
	drawNearbyLineDrawCtxFnFromNearbyLinesStateOptimisedV2,
	drawSelectedBox,
	drawSelectedStringBoxV3,
	drawSelectedStringBoxWithStats,
	drawSelectionDragBox,
} from './render-fns'
import { inject, Injectable } from '@angular/core'
import { assertNotNull, shadeColor } from '@shared/utils'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import {
	EntityStoreService,
	PanelLinksService,
	PanelLinksStoreService,
	StringsStatsService,
} from '@entities/data-access'
import {
	getNegativeSymbolLocation,
	getPositiveSymbolLocation,
	getSymbolLocations,
	isPanel,
} from '@entities/utils'
import { AngleDegrees, Point } from '@shared/data-access/models'
import { toRadians } from '@canvas/utils'
import {
	CANVAS_COLORS,
	CanvasEntity,
	CanvasPanel,
	CanvasString,
	PANEL_STROKE_STYLE,
	PanelLinkModel,
	UndefinedStringId,
} from '@entities/shared'
import { injectSvgs, injectSvgsV2 } from './svg-injector'
import { SvgCursorImageRecord } from '../../svgs'
import { throttle } from 'lodash'
import { ObjectPositioningStoreService } from '@canvas/object-positioning/data-access'

@Injectable({
	providedIn: 'root',
})
export class RenderService {
	private _canvasElementService = inject(CanvasElementService)
	private _divElements = inject(DivElementsService)
	private _entities = inject(EntityStoreService)
	// private _entities = inject(EntityStoreService)
	// private _entities = inject(EntityStoreService)
	// private _app = inject(AppStoreService)
	// private _appStore = inject(AppNgrxStateStore)
	private _appStore = inject(AppStateStoreService)
	private _selectedStore = injectSelectedStore()
	// private _selectedStore = inject(SelectedStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	private _panelLinksStore = inject(PanelLinksStoreService)
	private _panelLinks = inject(PanelLinksService)
	private _objectPositioningStore = inject(ObjectPositioningStoreService)
	private _stringStats = inject(StringsStatsService)

	private _throttleRender = false
	private _renderOptions: Partial<CanvasRenderOptions> = {}
	private lastRenderTime = performance.now()
	private lastFrameTime = performance.now()
	private framesThisSecond = 0
	// private _panelsStore = injectPanelsFeature()
	private _previousFpsStats = [0, 0, 0]

	private _clickNearEntityTimer: ReturnType<typeof setTimeout> | undefined
	private _clickNearEntityBounds:
		| {
				top: number
				left: number
				width: number
				height: number
		  }
		| undefined

	private set fpsStats(value: number) {
		this._previousFpsStats.shift()
		this._previousFpsStats.push(value)
		// this._svgs
	}

	private get averageFps() {
		if (this._previousFpsStats[this._previousFpsStats.length - 1] === 0) {
			return 0
		}
		return this._previousFpsStats.reduce((a, b) => a + b) / this._previousFpsStats.length
	}

	_svgs = injectSvgs()
	_svgs2 = injectSvgsV2()
	_imageElement: HTMLImageElement | undefined
	_svgCursorImages: SvgCursorImageRecord | undefined
	throttledRenderCanvasApp = throttle(this.renderFn, 1000 / 60)

	constructor() {
		this.checkFps()
		/*		this._svgs2.then((data) => {
		 this._imageElement = data
		 // console.log('data', data)
		 })
		 initSvgCursorImages().then((r) => (this._svgCursorImages = r))*/
		// this.renderAt60FPS()
		// this.renderCanvasAppAt60FPS()
	}

	get renderOptions() {
		return this._renderOptions
	}

	set renderOptions(value: Partial<CanvasRenderOptions>) {
		this._renderOptions = value
	}

	get ctx() {
		return this._canvasElementService.ctx
	}

	get canvas() {
		return this._canvasElementService.canvas
	}

	// private _fpsElement: HTMLDivElement | undefined

	// private _fpsElement = document.getElementById(DIV_ELEMENT.FPS)

	get allPanels() {
		return this._entities.panels.allPanels
		// return this._entities.panels.allPanels
		// return this._state.entities.panels.getEntities()
	}

	get fpsEl() {
		return this._divElements.getElementByIdOrUndefined(DIV_ELEMENT.FPS)
		// return this._divElements.getElementById(DIV_ELEMENT.FPS)
		/*		if (!this._fpsElement) {
		 this._fpsElement = document.getElementById(DIV_ELEMENT.FPS) as HTMLDivElement
		 }
		 return this._fpsElement*/
	}

	renderCanvasApp(options?: Partial<CanvasRenderOptions>) {
		if (this._throttleRender) {
			this.throttledRenderCanvasApp(options)
			return
		}

		this.renderFn(options)
	}

	renderFn(options?: Partial<CanvasRenderOptions>) {
		this.render((ctx) => {
			ctx.save()
			ctx.strokeStyle = PANEL_STROKE_STYLE.DEFAULT
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			const customPanels = options?.customPanels
			const entities = !customPanels
				? this.allPanels
				: this.allPanels
						.filter((entity) => {
							return !customPanels.map((panel) => panel.id).includes(entity.id)
						})
						.concat(customPanels)
						.filter((entity) => {
							if (!options?.nearby) return true

							const { snapToGridBool, entityToMove } = options.nearby
							if (snapToGridBool && entityToMove) {
								return entity.id !== entityToMove.id
							}
							return true
						})

			this.drawEntities(ctx, entities)
			ctx.restore()

			if (
				this._graphicsStore.state.linkModePathLines &&
				this._selectedStore.state.selectedStringId &&
				this._appStore.state.mode === 'LinkMode'
			) {
				this.drawLinkModePathLinesV2(ctx, entities)
				// this.drawLinkModePathLinesV2(ctx, options?.customEntities)
			}

			if (this._entities.panelLinks.hoveringOverPanelInLinkMenuId) {
				const panel = this._entities.panels.getById(
					this._entities.panelLinks.hoveringOverPanelInLinkMenuId,
				)
				assertNotNull(panel, 'panel')
				drawBoxWithOptionsCtx(ctx, [panel], {
					color: CANVAS_COLORS.HoveringOverPanelInLinkMenuStrokeStyle,
					lineWidth: 2,
					padding: 5,
				})
			}

			const shouldRenderSelectedEntitiesBox = options?.shouldRenderSelectedEntitiesBox ?? true
			const shouldRenderSelectedStringBox = options?.shouldRenderSelectedStringBox ?? true

			const multipleSelectedEntityIds = this._selectedStore.state.multipleSelectedEntityIds
			if (shouldRenderSelectedEntitiesBox && multipleSelectedEntityIds.length) {
				drawSelectedBox(ctx, this._entities.panels.getByIds(multipleSelectedEntityIds))
			} else if (
				shouldRenderSelectedEntitiesBox &&
				this._selectedStore.state.singleSelectedEntityId
			) {
				const selectedEntity = this._entities.panels.getById(
					this._selectedStore.state.singleSelectedEntityId,
				)
				assertNotNull(selectedEntity, 'selectedEntity')
				drawSelectedBox(ctx, [selectedEntity])
			}

			const selectedStringId = this._selectedStore.state.selectedStringId

			if (shouldRenderSelectedStringBox && selectedStringId) {
				const selectedString = this._entities.strings.getById(selectedStringId)
				assertNotNull(selectedString, 'selectedString')
				// const selectedStringPanels = this._entities.panels.getByStringId(selectedString.id)

				// drawSelectedStringBoxV3(ctx, selectedString, selectedStringPanels)
				if (shouldRenderSelectedEntitiesBox && multipleSelectedEntityIds.length) {
					drawSelectedBox(ctx, this._entities.panels.getByIds(multipleSelectedEntityIds))
				}
			}

			if (this._graphicsStore.state.stringBoxes) {
				/*				const stringsWithPanels = getStringsWithPanelsBasedOffSelectedString(
				 selectedStringId,
				 this._entities,
				 )*/
				if (selectedStringId) {
					const string = this._entities.strings.getById(selectedStringId)
					assertNotNull(string, 'selectedString')
					const panels = this._entities.panels.getByStringId(string.id)
					const stringStats = this._stringStats.calculateStringStatsForSelectedString()
					drawSelectedStringBoxWithStats(ctx, string, panels, stringStats)
				} else {
					const stringsWithPanels = this._entities.strings.allStrings.map((string) => ({
						string,
						panels: this._entities.panels.getByStringId(string.id),
					}))
					stringsWithPanels.forEach(({ string, panels }) => {
						drawSelectedStringBoxV3(ctx, string, panels)
					})
				}
			}

			if (options?.nearby && this._graphicsStore.state.nearbyLines) {
				const nearbyOpts = options.nearby
				const nearbyLinesState = this._graphicsStore.state.nearbyLinesState

				drawNearbyLineDrawCtxFnFromNearbyLinesStateOptimisedV2(
					ctx,
					nearbyLinesState,
					nearbyOpts,
					CANVAS_COLORS.HoveredPanelFillStyle,
				)
			}

			if (options?.selectionBox) {
				const selectionBox = options.selectionBox
				drawSelectionDragBox(ctx, selectionBox)
			}

			if (options?.creationBox) {
				const creationBox = options.creationBox
				drawCreationDragBox(ctx, creationBox)
			}

			if (options?.clickNearEntityBounds) {
				this._clickNearEntityBounds = options.clickNearEntityBounds
				this._clickNearEntityTimer = setTimeout(() => {
					this._clickNearEntityTimer = undefined
					clearTimeout(this._clickNearEntityTimer)
				}, 1000)
			}

			if (this._clickNearEntityTimer && this._clickNearEntityBounds) {
				drawClickNearEntityBounds(ctx, this._clickNearEntityBounds)
			}

			if (this._objectPositioningStore.state.toMoveMultipleSpotTakenIds.length) {
				const spotTakenIds = this._objectPositioningStore.state.toMoveMultipleSpotTakenIds
				const spotTakenPanels = entities.filter((panel) => spotTakenIds.includes(panel.id))
				drawBoxWithOptionsCtx(ctx, spotTakenPanels, {
					color: CANVAS_COLORS.SpotTakenStrokeStyle,
					lineWidth: 1,
					padding: 5,
				})
			}

			if (options?.creationPreviewBounds) {
				drawEntityCreationPreview(ctx, options.creationPreviewBounds)
			}
		})
	}

	private checkFps() {
		const currentTime = performance.now()
		const deltaTime = currentTime - this.lastRenderTime

		if (deltaTime >= 1000) {
			this.fpsStats = this.framesThisSecond / (deltaTime / 1000)
			if (this.fpsEl) {
				this.fpsEl.innerText = `${this.averageFps.toFixed(1)} FPS`
			}
			this.framesThisSecond = 0
			this.lastRenderTime = currentTime
		}
		requestAnimationFrame(() => this.checkFps())
	}

	private render(fn: (ctx: CanvasRenderingContext2D) => void) {
		this.framesThisSecond++
		this.ctx.save()
		fn(this.ctx)
		this.ctx.restore()
	}

	private drawEntities(ctx: CanvasRenderingContext2D, entities: CanvasPanel[]) {
		entities.forEach((entity) => {
			/**
			 * Draw Entity
			 */

			if (!isPanel(entity)) return
			let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
			const strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT

			const graphicsState = this._graphicsStore.state

			if (graphicsState.colouredStrings) {
				if (entity.stringId !== UndefinedStringId) {
					const string = this._entities.strings.getById(entity.stringId)
					assertNotNull(string)
					fillStyle = string.color
				}
			}

			const selectedState = this._selectedStore.state

			if (graphicsState.selectedPanelFill) {
				const isSingleSelected =
					selectedState.singleSelectedEntityId && selectedState.singleSelectedEntityId === entity.id
				if (isSingleSelected) {
					fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
				}

				const isMultipleSelected =
					selectedState.multipleSelectedEntityIds.length &&
					selectedState.multipleSelectedEntityIds.includes(entity.id)
				if (isMultipleSelected) {
					fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
				}
			}

			const isStringSelected =
				selectedState.selectedStringId && selectedState.selectedStringId === entity.stringId

			if (isStringSelected && graphicsState.selectedStringPanelFill) {
				fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
			}

			// let panelLinkOrderDrawFn: ((ctx: CanvasRenderingContext2D) => void) | undefined = undefined
			if (this._appStore.state.mode === MODE_STATE.LINK_MODE) {
				if (this._panelLinksStore.requestingLink) {
					if (this._panelLinksStore.requestingLink.panelId === entity.id) {
						fillStyle = CANVAS_COLORS.RequestingLinkPanelFillStyle
					}
				}
				/*
				 if (isStringSelected) {
				 assertNotNull(selectedState.selectedStringId)

				 const linksInOrder = this._panelLinks.getPanelLinkOrderForString(
				 selectedState.selectedStringId,
				 )
				 const linkIndex = linksInOrder.findIndex((link) => link?.positivePanel.id === entity.id)
				 if (linkIndex !== -1) {
				 panelLinkOrderDrawFn = (ctx) => {
				 ctx.save()
				 const fontSize = 10
				 ctx.font = `${fontSize}px Consolas, sans-serif`
				 const text = `${linkIndex + 1}`
				 const metrics = ctx.measureText(text)
				 const x = 0 - metrics.width / 2
				 const y = fontSize / 4
				 ctx.fillStyle = 'black'
				 ctx.fillText(text, x, y)
				 ctx.restore()
				 }
				 }
				 }*/
			}

			const pointerState = this._appStore.state.pointer
			const hoveringOverEntityId = pointerState.hoveringOverEntityId
			const isBeingHovered = !!hoveringOverEntityId && hoveringOverEntityId === entity.id

			if (selectedState.selectedStringId) {
				if (selectedState.selectedStringId !== entity.stringId || !isStringSelected) {
					fillStyle = CANVAS_COLORS.UnselectedPanelFillStyle
				}
			}

			if (isBeingHovered) {
				// fillStyle = '#17fff3'
				if (isStringSelected && graphicsState.selectedStringPanelFill) {
					fillStyle = shadeColor(CANVAS_COLORS.StringSelectedPanelFillStyle, 50)
				}
				fillStyle = shadeColor(fillStyle, 50)
			}

			ctx.save()
			ctx.fillStyle = fillStyle
			ctx.strokeStyle = strokeStyle
			ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
			ctx.rotate(entity.angle)
			ctx.beginPath()
			ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()
			/*			if (panelLinkOrderDrawFn) {
			 panelLinkOrderDrawFn(ctx)
			 }*/

			// draw drawLinkModeGraphics
			if (isStringSelected && this._appStore.state.mode === 'LinkMode') {
				if (this._graphicsStore.state.linkModeSymbols) {
					this.drawLinkModeSymbols(ctx, entity)
				}
				if (this._graphicsStore.state.linkModeOrderNumbers) {
					this.drawLinkModeOrderNumbers(ctx, entity)
				}
			}
			/*				if (
			 isStringSelected &&
			 this._graphicsStore.state.linkModeSymbols &&
			 this._appStore.state.mode === 'LinkMode'
			 ) {
			 this.drawLinkModeSymbols(ctx, entity)
			 }*/
			ctx.restore()
		})
	}

	private drawLinkModeSymbols(ctx: CanvasRenderingContext2D, panel: CanvasPanel) {
		const lineLength = 5
		ctx.save()

		// draw negative symbol
		ctx.save()
		ctx.translate(-panel.width / 2, 0)
		ctx.save()
		ctx.rotate(toRadians(45 as AngleDegrees))
		ctx.strokeStyle = 'black'
		ctx.strokeRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
		ctx.fillStyle = 'blue'
		ctx.fillRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
		ctx.restore()

		ctx.strokeStyle = 'white'
		ctx.beginPath()
		ctx.moveTo(-lineLength / 2, 0)
		ctx.lineTo(lineLength / 2, 0)
		ctx.stroke()
		ctx.restore()

		// draw positive symbol
		ctx.save()
		ctx.translate(panel.width / 2, 0)
		ctx.save()
		ctx.rotate(toRadians(45 as AngleDegrees))
		ctx.strokeStyle = 'black'
		ctx.strokeRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
		ctx.fillStyle = 'red'
		ctx.fillRect(-lineLength / 2, -lineLength / 2, lineLength, lineLength)
		ctx.restore()

		ctx.strokeStyle = 'white'
		ctx.beginPath()
		ctx.moveTo(-lineLength / 2, 0)
		ctx.lineTo(lineLength / 2, 0)
		ctx.moveTo(0, -lineLength / 2)
		ctx.lineTo(0, lineLength / 2)
		ctx.stroke()
		ctx.restore()

		ctx.restore()
	}

	private drawLinkModeOrderNumbers(ctx: CanvasRenderingContext2D, panel: CanvasPanel) {
		const linksInOrder = this._panelLinks.getPanelLinkOrderForSelectedStringV2()
		if (!linksInOrder.length) {
			return
		}
		linksInOrder.forEach((linkChain) => {
			const chainSorted = getChainSorted(linkChain)
			const isPanelInThisChain =
				chainSorted.some((link) => link?.positivePanelId === panel.id) ||
				chainSorted[chainSorted.length - 1]?.negativePanelId === panel.id
			if (!isPanelInThisChain) {
				return
			}
			const linkIndex = chainSorted.findIndex((link) => link?.positivePanelId === panel.id)
			const chainIndex = linkIndex !== -1 ? linkIndex : chainSorted.length
			ctx.save()
			const fontSize = 10
			ctx.font = `${fontSize}px Consolas, sans-serif`
			const text = `${chainIndex + 1}`
			const metrics = ctx.measureText(text)
			const x = 0 - metrics.width / 2
			const y = fontSize / 4

			ctx.fillStyle = 'black'

			ctx.fillText(text, x, y)
			ctx.restore()
			/*			if (linkIndex !== -1) {
			 ctx.save()
			 const fontSize = 10
			 ctx.font = `${fontSize}px Consolas, sans-serif`
			 const text = `${linkIndex + 1}`
			 const metrics = ctx.measureText(text)
			 const x = 0 - metrics.width / 2
			 const y = fontSize / 4
			 ctx.fillStyle = 'black'
			 ctx.fillText(text, x, y)
			 ctx.restore()
			 } else if (chainSorted[chainSorted.length - 1]?.negativePanelId === panel.id) {
			 ctx.save()
			 const fontSize = 10
			 ctx.font = `${fontSize}px Consolas, sans-serif`
			 const text = `${chainSorted.length + 1}`
			 const metrics = ctx.measureText(text)
			 const x = 0 - metrics.width / 2
			 const y = fontSize / 4
			 ctx.fillStyle = 'black'
			 ctx.fillText(text, x, y)
			 ctx.restore()
			 }*/
		})
	}

	private drawLinkModeOrderNumbersOld(ctx: CanvasRenderingContext2D, panel: CanvasPanel) {
		const linksInOrder = this._panelLinks.getPanelLinkOrderForSelectedString()
		if (!linksInOrder.length) {
			return
		}
		const linkIndex = linksInOrder.findIndex((link) => link?.positivePanelId === panel.id)
		if (linkIndex !== -1) {
			ctx.save()
			const fontSize = 10
			ctx.font = `${fontSize}px Consolas, sans-serif`
			const text = `${linkIndex + 1}`
			const metrics = ctx.measureText(text)
			const x = 0 - metrics.width / 2
			const y = fontSize / 4
			ctx.fillStyle = 'black'
			ctx.fillText(text, x, y)
			ctx.restore()
		} else if (linksInOrder[linksInOrder.length - 1].negativePanelId === panel.id) {
			ctx.save()
			const fontSize = 10
			ctx.font = `${fontSize}px Consolas, sans-serif`
			const text = `${linksInOrder.length + 1}`
			const metrics = ctx.measureText(text)
			const x = 0 - metrics.width / 2
			const y = fontSize / 4
			ctx.fillStyle = 'black'
			ctx.fillText(text, x, y)
			ctx.restore()
		}
	}

	private drawLinkModePathLines(
		ctx: CanvasRenderingContext2D,
		customEntities: CanvasEntity[] | undefined,
	) {
		const customIds = customEntities?.map((entity) => entity.id) ?? []
		const linksInOrder = this._panelLinks.getPanelLinkOrderForSelectedString().map((link) => ({
			positivePanel: this._entities.panels.getById(link.positivePanelId),
			negativePanel: this._entities.panels.getById(link.negativePanelId),
		}))
		if (!linksInOrder.length) {
			return
		}
		ctx.save()
		ctx.strokeStyle = 'black'
		ctx.lineWidth = 1

		let firstHasBeenSet = false
		linksInOrder.forEach((link) => {
			const panel = link.positivePanel
			assertNotNull(panel, 'panel')

			const [p1, p2] = customIds.includes(panel.id)
				? getSymbolLocations(
						customEntities?.find((entity) => entity.id === panel.id) as CanvasPanel,
				  )
				: getSymbolLocations(panel)
			if (!firstHasBeenSet) {
				firstHasBeenSet = true
			} else {
				ctx.lineTo(p1.x, p1.y)
			}
			ctx.moveTo(p2.x, p2.y)
		})
		const lastPanel = linksInOrder[linksInOrder.length - 1].negativePanel
		assertNotNull(lastPanel, 'lastPanel')
		const { x: lastX, y: lastY } = customIds.includes(lastPanel.id)
			? getNegativeSymbolLocation(
					customEntities?.find((entity) => entity.id === lastPanel.id) as CanvasPanel,
			  )
			: getNegativeSymbolLocation(lastPanel)
		ctx.lineTo(lastX, lastY)
		ctx.stroke()
		ctx.restore()
	}

	private drawLinkModePathLinesV2(
		ctx: CanvasRenderingContext2D,
		customEntities: CanvasEntity[] | undefined,
	) {
		const customIds = customEntities?.map((entity) => entity.id) ?? []
		const linksInOrder = this._panelLinks.getPanelLinkOrderForSelectedStringWithPoints()
		if (!linksInOrder.length) {
			return
		}
		ctx.save()
		ctx.strokeStyle = 'black'
		ctx.lineWidth = 1

		linksInOrder.forEach((link) => {
			link.linePoints.forEach((linePoint, index) => {
				const drawFn = index === 0 ? ctx.moveTo : ctx.lineTo
				const currentPanelId = index === 0 ? link.positivePanelId : link.negativePanelId
				const point = customIds.includes(currentPanelId)
					? getSymbolLocationBasedOnIndex(index, customEntities, currentPanelId)
					: linePoint
				drawFn.call(ctx, point.x, point.y)
			})

			ctx.save()
			if (this._selectedStore.selectedPanelLinkId === link.id) {
				ctx.strokeStyle = 'red'
				ctx.lineWidth = 2
			}

			ctx.stroke()
			ctx.restore()
		})
		ctx.restore()
	}
}

const FRAMES_PER_SECOND = 30 // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000 / 60) * (60 / FRAMES_PER_SECOND) - (1000 / 60) * 0.5

export const getSymbolLocationBasedOnIndex = (
	index: number,
	customEntities: CanvasEntity[] | undefined,
	panelId: string,
): Point => {
	if (!customEntities) {
		throw new Error('customEntities is undefined')
	}
	const panel = customEntities?.find((entity) => entity.id === panelId) as CanvasPanel
	if (index === 0) {
		return getPositiveSymbolLocation(panel)
	}
	return getNegativeSymbolLocation(panel)
}

/*
 function getSymbolLocations(panel: CanvasPanel): [Point, Point] {
 const { x, y, width, height } = panel
 const p1 = { x: x + width / 2, y }
 const p2 = { x: x + width / 2, y: y + height }
 return [p1, p2]
 }*/

function getStringsWithPanelsBasedOffSelectedString(
	selectedStringId: string | undefined,
	entityStore: EntityStoreService,
): {
	string: CanvasString
	panels: CanvasPanel[]
}[] {
	if (selectedStringId) {
		const string = entityStore.strings.getById(selectedStringId)
		assertNotNull(string, 'selectedString')
		return [
			{
				string,
				panels: entityStore.panels.getByStringId(string.id),
			},
		]
	}
	return entityStore.strings.allStrings.map((string) => ({
		string,
		panels: entityStore.panels.getByStringId(string.id),
	}))
}

function getChainSorted(linkChain: PanelLinkModel[]) {
	return linkChain.sort((a, b) => {
		if (!a || !b) {
			return 0
		}
		return a.positivePanelId === b.negativePanelId ? 1 : -1
	})
}
