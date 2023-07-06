import {
	CanvasElementService,
	DIV_ELEMENT,
	DivElementsService,
	injectAppStateStore,
	MODE_STATE,
} from '@canvas/app/data-access'
import { injectSelectedStore } from '@canvas/selected/data-access'
import { CanvasRenderOptions, DrawPanelsOptions } from '../../types'
import {
	drawBoxWithOptionsCtx,
	drawClickNearEntityBounds,
	drawCreationDragBox,
	drawCursor,
	drawDisconnectionPointBox,
	drawEntityCreationPreview,
	drawLinkModeOrderNumbers,
	drawLinkModePathLinesCurvedAlreadyMappedV6,
	drawLinkModeSymbols,
	drawNearbyLineDrawCtxFnFromNearbyLinesStateOptimisedV2,
	drawSelectedBox,
	drawSelectedStringBoxWithStats,
	drawSelectionDragBox,
	drawTooltipWithOptionsCtx,
	handleCustomEntitiesBeforeLinkRender,
} from './render-fns'
import { computed, effect, inject, Injectable } from '@angular/core'
import { assertNotNull, shadeColor } from '@shared/utils'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import {
	injectEntityStore,
	injectProjectsStore,
	injectUserPointsStore,
	StringsStatsService,
} from '@entities/data-access'
import { getNegativeSymbolLocation, getPositiveSymbolLocation, isPanel } from '@entities/utils'
import { Point } from '@shared/data-access/models'
import {
	CANVAS_COLORS,
	EntityBase,
	getEntitySize,
	PANEL_STROKE_STYLE,
	PanelModel,
	UNDEFINED_STRING_ID,
	UNDEFINED_STRING_NAME,
} from '@entities/shared'
import { throttle } from 'lodash'
import { ObjectPositioningStoreService } from '@canvas/object-positioning/data-access'
import { injectAppUser, injectAuthStore } from '@auth/data-access'
import { injectUiStore } from '@overlays/ui-store/data-access'

@Injectable({
	providedIn: 'root',
})
export class RenderService {
	private _canvasElementService = inject(CanvasElementService)
	private _divElements = inject(DivElementsService)
	private _entities = injectEntityStore()
	private _authStore = injectAuthStore()
	private _uiStore = injectUiStore()
	// private _entities = injectEntityStore()
	// private _entities = injectEntityStore()
	// private _app = inject(AppStoreService)
	// private _appStore = inject(AppNgrxStateStore)
	private _appStore = injectAppStateStore()
	// private _appStore = inject(AppStateStoreService)
	private _selectedStore = injectSelectedStore()
	// private _selectedStore = inject(SelectedStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	// private _panelLinks = inject(PanelLinksService)
	private _objectPositioningStore = inject(ObjectPositioningStoreService)
	private _stringStats = inject(StringsStatsService)
	private _projectsStore = injectProjectsStore()

	private _userPointsStore = injectUserPointsStore()
	private _throttleRender = false

	// private _linkRender = new LinkPathRenderService()
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

	private get isLoggedIn() {
		return !!this._authStore.select.user()
	}

	private get averageFps() {
		if (this._previousFpsStats[this._previousFpsStats.length - 1] === 0) {
			return 0
		}
		return this._previousFpsStats.reduce((a, b) => a + b) / this._previousFpsStats.length
	}

	// * For rendering mouse cursors for other users in same project
	// _userPointsEffect = effect(() => {
	// 	const userPoints = this._userPointsStore.select.allPoints()
	// 	if (userPoints) {
	// 		this.renderCanvasApp({
	// 			userPoints,
	// 		})
	// 	}
	// 	this._userPointsStore.dispatch.deleteManyPoints(userPoints.map((p) => p.id))
	// })
	offset = 0
	throttledRenderCanvasApp = throttle(this.renderFn, 1000 / 60)

	user = injectAppUser()
	isEmptyProjectState = computed(() => {
		return !!this.user() && this._projectsStore.select.allProjects().length === 0
	})

	constructor() {
		this.checkFps()
		effect(() => {
			if (this.isProjectReadyToRender) {
				this.renderCanvasApp()
			}
		})
		effect(() => {
			const isEmptyProjectState = this.isEmptyProjectState()
			if (isEmptyProjectState) {
				if (this.ctx) {
					this.clearCanvas(this.ctx)
				}
			}
		})
	}

	get isProjectReadyToRender() {
		return (
			(this._projectsStore.select.projectReadyToRender() && !!this._authStore.select.user()) ||
			(!this._authStore.select.user() && this._authStore.select.guest())
		)
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
		return this._entities.panels.select.allPanels()
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
		if (this.isEmptyProjectState()) return
		if (!this.isProjectReadyToRender) return
		if (this._throttleRender) {
			this.throttledRenderCanvasApp(options)
			return
		}

		if (!this.ctx) return

		this.renderFn(options)
	}

	private renderFn(options?: Partial<CanvasRenderOptions>) {
		this.render((ctx) => {
			ctx.save()
			ctx.strokeStyle = PANEL_STROKE_STYLE.DEFAULT
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			const customPanels = options?.customPanels
			const panels = !customPanels
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

			// console.log('renderFn', panels)
			// console.log('renderFn', panels.length)

			const appState = this._appStore.select.appState()
			const graphicsState = this._graphicsStore.state

			const singleSelectedPanelId = this._selectedStore.select.singleSelectedPanelId()
			const singleSelectedPanel =
				this._entities.panels.select.getByIdOrUndefined(singleSelectedPanelId)

			const multipleSelectedPanelIds = this._selectedStore.select.multipleSelectedPanelIds()
			const multipleSelectedPanels = multipleSelectedPanelIds.length
				? panels.filter((panel) => multipleSelectedPanelIds.includes(panel.id))
				: []

			const selectedState = this._selectedStore.select.selectedState()
			const selectedStringId = selectedState.selectedStringId
			const selectedString = selectedStringId
				? this._entities.strings.select.getById(selectedStringId)
				: undefined
			const selectedStringPanels = selectedStringId
				? panels.filter((panel) => panel.stringId === selectedStringId)
				: []
			const selectedStringPanelLinks = selectedStringId
				? this._entities.panelLinks.select.getByStringId(selectedStringId)
				: []

			const selectedStringCircuit = this._entities.panelLinks.select.selectedStringCircuit()
			const openCircuitChains = selectedStringCircuit ? selectedStringCircuit.openCircuitChains : []
			const circuitLinkLines = selectedStringCircuit ? selectedStringCircuit.circuitLinkLines : []

			const hoveringOverPanelId = appState.pointer.hoveringOverPanelId
			const hoveringOverPanel = this._entities.panels.select.getByIdOrUndefined(hoveringOverPanelId)
			const hoveringOverPanelInLinkMenuId =
				this._entities.panelLinks.select.hoveringOverPanelInLinkMenuId()
			const hoveringOverPanelLinkInLinkMenu =
				this._entities.panelLinks.select.hoveringOverPanelLinkInLinkMenu()
			const hoveringOverPanelLinkInApp =
				this._entities.panelLinks.select.hoveringOverPanelLinkInApp()

			const toMoveMultipleSpotTakenIds =
				this._objectPositioningStore.state.toMoveMultipleSpotTakenIds

			const selectedPanelLinkId = this._selectedStore.select.selectedPanelLinkId()
			const panelLinkUnderMouse = this._entities.panelLinks.select.hoveringOverPanelLinkInApp()
			const panelLinkRequest = options?.panelLinkRequest
			const requestingLink = this._entities.panelLinks.select.requestingLink()

			const shouldRenderSelectedEntitiesBox = options?.shouldRenderSelectedEntitiesBox ?? true
			const shouldRenderSelectedStringBox = options?.shouldRenderSelectedStringBox ?? true

			const drawPanelsOptions: DrawPanelsOptions = {
				panels,
				openCircuitChains,
				graphicsState,
				appState,
				selectedString,
				singleSelectedPanel,
				hoveringOverPanelId,
				requestingLink,
				selectedState,
			}

			this.drawPanels(ctx, drawPanelsOptions)
			ctx.restore()

			if (shouldRenderSelectedEntitiesBox && multipleSelectedPanels.length) {
				drawSelectedBox(ctx, multipleSelectedPanels)
			} else if (shouldRenderSelectedEntitiesBox && singleSelectedPanel) {
				// const selectedEntity = this._entities.panels.select.getById(singleSelectedPanelId)
				assertNotNull(singleSelectedPanel, 'selectedEntity')
				drawSelectedBox(ctx, [singleSelectedPanel])
			}

			if (shouldRenderSelectedStringBox && selectedString) {
				// const selectedString = this._entities.strings.select.getById(selectedStringId)
				// assertNotNull(selectedString, 'selectedString')
				if (shouldRenderSelectedEntitiesBox && multipleSelectedPanels.length) {
					drawSelectedBox(ctx, multipleSelectedPanels)
				}
			}

			if (graphicsState.stringBoxes) {
				if (selectedString) {
					// const string = this._entities.strings.select.getById(selectedStringId)
					// assertNotNull(string, 'selectedString')
					const stringStats = this._stringStats.calculateStringStatsForSelectedString()
					drawSelectedStringBoxWithStats(ctx, selectedString, selectedStringPanels, stringStats)
				}
				// * draw all string boxes
				/* else {
				 const stringsWithPanels = this._entities.strings.select.allStrings().map((string) => ({
				 string,
				 panels: this._entities.panels.select.getByStringId(string.id),
				 }))
				 stringsWithPanels.forEach(({ string, panels }) => {
				 drawSelectedStringBoxV3(ctx, string, panels)
				 }*/
			}

			if (options?.nearby && graphicsState.nearbyLines) {
				const nearbyOpts = options.nearby
				const nearbyLinesState = graphicsState.nearbyLinesState

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
				drawCreationDragBox(ctx, creationBox, this.isLoggedIn)
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

			if (toMoveMultipleSpotTakenIds.length) {
				const spotTakenIds = toMoveMultipleSpotTakenIds
				const spotTakenPanels = panels.filter((panel) => spotTakenIds.includes(panel.id))
				drawBoxWithOptionsCtx(ctx, spotTakenPanels, {
					color: CANVAS_COLORS.SpotTakenStrokeStyle,
					lineWidth: 1,
					padding: 5,
				})
			}

			if (options?.creationPreviewBounds) {
				drawEntityCreationPreview(ctx, options.creationPreviewBounds)
			}

			// &&
			// 	appStateMode === 'LinkMode'
			/**
			 * * Draw the link lines
			 */
			if (graphicsState.linkModePathLines && selectedStringId) {
				const customLinkLineTuples = handleCustomEntitiesBeforeLinkRender(
					circuitLinkLines,
					selectedStringPanelLinks,
					selectedStringId,
					options,
					panelLinkRequest,
				)

				const mouseDownPanelSymbol = options?.draggingSymbolLinkLine?.mouseDownPanelSymbol

				const panelLinkForSelectedPanel = singleSelectedPanel
					? this._entities.panelLinks.select.getLinksMappedByPanelId(singleSelectedPanel.id)
					: undefined

				drawLinkModePathLinesCurvedAlreadyMappedV6(
					ctx,
					panels,
					customLinkLineTuples,
					panelLinkUnderMouse,
					hoveringOverPanelLinkInLinkMenu,
					selectedPanelLinkId,
					mouseDownPanelSymbol,

					singleSelectedPanel,
					panelLinkForSelectedPanel,
					openCircuitChains,
				)
			}

			if (panelLinkRequest) {
				drawBoxWithOptionsCtx(ctx, [panelLinkRequest.panel], {
					color: CANVAS_COLORS.HoveringOverPanelInLinkMenuStrokeStyle,
					lineWidth: 2,
					padding: 5,
				})
			}

			if (selectedString && selectedString.disconnectionPointId) {
				const disconnectionPointPanel = this._entities.panels.select.getById(
					selectedString.disconnectionPointId,
				)
				assertNotNull(disconnectionPointPanel, 'disconnectionPointPanel')
				drawDisconnectionPointBox(ctx, disconnectionPointPanel)
			}

			if (hoveringOverPanelInLinkMenuId) {
				const panel = this._entities.panels.select.getById(hoveringOverPanelInLinkMenuId)
				assertNotNull(panel, 'panel')
				drawBoxWithOptionsCtx(ctx, [panel], {
					color: CANVAS_COLORS.HoveringOverPanelInLinkMenuStrokeStyle,
					lineWidth: 2,
					padding: 5,
				})
			}

			if (hoveringOverPanelLinkInLinkMenu) {
				const panel = this._entities.panels.select.getById(hoveringOverPanelLinkInLinkMenu.panelId)
				assertNotNull(panel, 'panel')
				drawBoxWithOptionsCtx(ctx, [panel], {
					color: CANVAS_COLORS.HoveringOverPanelInLinkMenuStrokeStyle,
					lineWidth: 2,
					padding: 5,
				})
			}

			if (hoveringOverPanelLinkInApp && options?.transformedPoint) {
				const panelLink = hoveringOverPanelLinkInApp
				const point = {
					x: options?.transformedPoint.x + 50,
					y: options?.transformedPoint.y - 50,
				}
				drawTooltipWithOptionsCtx(ctx, point, panelLink.id)
			}

			// * Draw the cursor for other users
			if (options?.userPoints && options.userPoints.length > 0) {
				for (const userPoint of options.userPoints) {
					drawCursor(ctx, userPoint)
				}
				// const userPointIds = options.userPoints.map((userPoint) => userPoint.id)
				// this._userPointsStore.dispatch.deleteManyPoints(userPointIds)
			}

			// * Draw the tooltip
			// if (hoveringOverPanel) {
			// 	const { width } = getEntitySize(hoveringOverPanel)
			// 	const point = {
			// 		x: hoveringOverPanel.location.x + width * 2,
			// 		y: hoveringOverPanel.location.y - width * 2,
			// 	}
			// 	drawTooltipWithOptionsCtx(ctx, point, hoveringOverPanel.id)
			// }

			/*			const isMobile = this._uiStore.select.isMobile()
			 if (isMobile) {
			 if (singleSelectedPanel) {
			 drawMoveSvg(ctx, singleSelectedPanel.location)
			 console.log('drawMoveSvg singleSelectedPanel', singleSelectedPanel)
			 }
			 }*/
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
		/*		const animate = () => {

		 requestAnimationFrame(animate)
		 }*/
		/*		this.offset += 0.5
		 if (this.offset > 16) {
		 this.offset = 0
		 }*/

		// requestAnimationFrame(animate)
		requestAnimationFrame(() => this.checkFps())
	}

	private render(fn: (ctx: CanvasRenderingContext2D) => void) {
		this.framesThisSecond++
		this.ctx.save()
		fn(this.ctx)
		this.ctx.restore()
	}

	private drawPanels(ctx: CanvasRenderingContext2D, options: DrawPanelsOptions) {
		const {
			panels,
			singleSelectedPanel,
			openCircuitChains,
			hoveringOverPanelId,
			selectedState,
			selectedString,
			graphicsState,
			appState,
			requestingLink,
		} = options
		const selectedStringId = selectedString?.id
		// const selectedStringId = this._selectedStore.select.selectedStringId()
		// const graphicsState = this._graphicsStore.state
		// const selectedState = this._selectedStore
		// const { singleSelectedPanelId, multipleSelectedPanelIds, selectedPanelLinkId } = selectedState
		/*		const selectedPanel = singleSelectedPanelId
		 ? this._entities.panels.select.getById(singleSelectedPanelId)
		 : undefined*/

		// const mouseOverSymbol = this._entities.panelLinks.select.hoveringOverPanelLinkInApp()

		for (let i = 0; i < panels.length; i++) {
			const entity = panels[i]
			/**
			 * Draw Panel
			 */

			const isBeingHovered = !!hoveringOverPanelId && hoveringOverPanelId === entity.id

			/*			if (!isPanel(entity)) {
			 console.error('not a panel', entity)
			 continue
			 }*/
			if (!isPanel(entity)) continue
			let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
			const strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT
			const isStringSelected = selectedStringId && selectedStringId === entity.stringId

			if (graphicsState.colouredStrings) {
				if (entity.stringId !== UNDEFINED_STRING_ID) {
					const string = this._entities.strings.select.getById(entity.stringId)
					// assertNotNull(string, JSON.stringify(entity, null, 2))
					if (string && string.colour && string.name !== UNDEFINED_STRING_NAME) {
						fillStyle = string.colour
					}
				}
			}

			if (graphicsState.selectedPanelFill) {
				const isSingleSelected =
					selectedState.singleSelectedPanelId && selectedState.singleSelectedPanelId === entity.id
				if (isSingleSelected) {
					fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
				}

				const isMultipleSelected =
					selectedState.multipleSelectedPanelIds.length &&
					selectedState.multipleSelectedPanelIds.includes(entity.id)
				if (isMultipleSelected) {
					fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
				}
			}

			if (isStringSelected && graphicsState.selectedStringPanelFill) {
				fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
			}

			if (appState.mode === MODE_STATE.LINK_MODE) {
				if (requestingLink) {
					if (requestingLink.panelId === entity.id) {
						fillStyle = CANVAS_COLORS.RequestingLinkPanelFillStyle
					}
				}
			}

			if (selectedStringId) {
				if (selectedStringId !== entity.stringId || !isStringSelected) {
					fillStyle = CANVAS_COLORS.UnselectedPanelFillStyle
				}
			}

			if (isBeingHovered) {
				if (isStringSelected && graphicsState.selectedStringPanelFill) {
					fillStyle = shadeColor(CANVAS_COLORS.StringSelectedPanelFillStyle, 50)
				}
				// console.log(fillStyle)
				fillStyle = shadeColor(fillStyle, 50)
			}

			const { width, height } = getEntitySize(entity)
			ctx.save()
			ctx.fillStyle = fillStyle
			ctx.strokeStyle = strokeStyle
			ctx.translate(entity.location.x + width / 2, entity.location.y + height / 2)
			ctx.rotate(entity.angle)
			ctx.beginPath()
			ctx.rect(-width / 2, -height / 2, width, height)
			ctx.fill()
			ctx.stroke()
			ctx.closePath()

			/**
			 * * Draw Link Symbols/Numbers
			 */
			if (isStringSelected && appState.mode === 'LinkMode') {
				/*				if (selectedString && selectedString.disconnectionPointId === entity.id) {
				 drawDisconnectionPoint(ctx, entity)
				 /!*			drawBoxWithOptionsCtx(ctx, [entity], {
				 color: CANVAS_COLORS.HoveringOverPanelInLinkMenuStrokeStyle,
				 lineWidth: 2,
				 padding: 5,
				 })*!/
				 }*/
				if (graphicsState.linkModeSymbols) {
					drawLinkModeSymbols(ctx, entity)
					// drawLinkModeSymbols(ctx, entity, mouseOverSymbol)
				}
			}
			if (
				isStringSelected &&
				this._graphicsStore.state.linkModeOrderNumbers &&
				openCircuitChains.length
			) {
				drawLinkModeOrderNumbers(ctx, entity, openCircuitChains, singleSelectedPanel)
			}
			ctx.restore()
		}
	}

	private clearCanvas(ctx: CanvasRenderingContext2D) {
		ctx.save()
		ctx.strokeStyle = PANEL_STROKE_STYLE.DEFAULT
		ctx.setTransform(1, 0, 0, 1, 0, 0)
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		ctx.restore()
	}
}

export const getSymbolLocationBasedOnIndex = (
	index: number,
	customEntities: EntityBase[] | undefined,
	panelId: string,
): Point => {
	if (!customEntities) {
		throw new Error('customEntities is undefined')
	}
	const panel = customEntities?.find((entity) => entity.id === panelId) as PanelModel
	if (index === 0) {
		return getPositiveSymbolLocation(panel)
	}
	return getNegativeSymbolLocation(panel)
}
