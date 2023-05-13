import {
	AppStateStoreService,
	CanvasElementService,
	DIV_ELEMENT,
	DivElementsService,
	MODE_STATE,
} from '@canvas/app/data-access'
// import { EntityStoreService } from '../entities'
import { SelectedStoreService } from '@canvas/selected/data-access'
import { CanvasRenderOptions } from '../../types'
import { drawSelectedBox, drawSelectedStringBoxV3 } from './render-fns'
import { inject, Injectable } from '@angular/core'
import {
	AngleDegrees,
	CANVAS_COLORS,
	CanvasEntity,
	CanvasPanel,
	PANEL_STROKE_STYLE,
	UndefinedStringId,
} from '@design-app/shared'
import { isPanel, toRadians } from '@design-app/utils'
import { assertNotNull, shadeColor } from '@shared/utils'
import { GraphicsStoreService } from '@canvas/graphics/data-access'
import { PanelLinksService, PanelLinksStoreService } from '@entities/panel-links/data-access'
import { EntityStoreService } from '@design-app/data-access'

@Injectable({
	providedIn: 'root',
})
export class RenderService {
	private _canvasElementService = inject(CanvasElementService)
	private _divElements = inject(DivElementsService)
	private _entities = inject(EntityStoreService)
	// private _entities = inject(EntityStoreService)
	// private _app = inject(AppStoreService)
	// private _appStore = inject(AppNgrxStateStore)
	private _appStore = inject(AppStateStoreService)
	private _selectedStore = inject(SelectedStoreService)
	private _graphicsStore = inject(GraphicsStoreService)
	private _panelLinksStore = inject(PanelLinksStoreService)
	private _panelLinks = inject(PanelLinksService)

	private lastRenderTime = performance.now()

	private framesThisSecond = 0

	private _previousFpsStats = [0, 0, 0]

	private set fpsStats(value: number) {
		this._previousFpsStats.shift()
		this._previousFpsStats.push(value)
	}

	private get averageFps() {
		if (this._previousFpsStats[this._previousFpsStats.length - 1] === 0) {
			return 0
		}
		return this._previousFpsStats.reduce((a, b) => a + b) / this._previousFpsStats.length
	}

	constructor() {
		this.checkFps()
	}

	get ctx() {
		return this._canvasElementService.ctx
	}

	get canvas() {
		return this._canvasElementService.canvas
	}

	get allPanels() {
		return this._entities.panels.allPanels
		// return this._state.entities.panels.getEntities()
	}

	get fpsEl() {
		return this._divElements.getElementById(DIV_ELEMENT.FPS)
	}

	private checkFps() {
		const currentTime = performance.now()
		const deltaTime = currentTime - this.lastRenderTime

		if (deltaTime) {
			this.fpsEl.innerText = `${this.averageFps.toFixed(1)} FPS`
		}

		if (deltaTime >= 1000) {
			this.fpsStats = this.framesThisSecond / (deltaTime / 1000)
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

	renderCanvasApp(options?: CanvasRenderOptions) {
		this.render((ctx) => {
			ctx.save()
			ctx.strokeStyle = PANEL_STROKE_STYLE.DEFAULT
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			const excludedIds = options?.excludedEntityIds
			const entities = excludedIds
				? this.allPanels.filter((entity) => {
						return !excludedIds.includes(entity.id)
				  })
				: this.allPanels
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
						selectedState.singleSelectedEntityId &&
						selectedState.singleSelectedEntityId === entity.id
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
			// ctx.closePath()
			ctx.restore()

			if (
				this._graphicsStore.state.linkModePathLines &&
				this._selectedStore.state.selectedStringId
			) {
				this.drawLinkModePathLines(ctx, options?.customEntities)
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
				const selectedString = this._entities.strings.entities[selectedStringId]
				assertNotNull(selectedString, 'selectedString')
				const selectedStringPanels = this._entities.panels.getByStringId(selectedString.id)

				drawSelectedStringBoxV3(ctx, selectedString, selectedStringPanels)
				if (shouldRenderSelectedEntitiesBox && multipleSelectedEntityIds.length) {
					drawSelectedBox(ctx, this._entities.panels.getByIds(multipleSelectedEntityIds))
				}
			}

			if (this._graphicsStore.state.stringBoxes) {
				const stringsWithPanels = this._entities.strings.allStrings.map((string) => ({
					string,
					panels: this._entities.panels.getByStringId(string.id),
				}))
				stringsWithPanels.forEach(({ string, panels }) => {
					drawSelectedStringBoxV3(ctx, string, panels)
				})
			}

			if (options?.drawFns) {
				options.drawFns.forEach((fn) => fn(ctx))
			}
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

		/*		const firstLink = linksInOrder[0]
		 const firstPanel = firstLink.positivePanel
		 assertNotNull(firstPanel, 'firstPanel')
		 const { x: firstX, y: firstY } = getPositiveSymbolLocation(firstPanel)
		 ctx.beginPath()
		 ctx.moveTo(firstX, firstY)*/
		// ctx.moveTo(firstPanel.location.x, firstPanel.location.y)
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
			/*		if (customIds.includes(panel.id)) {

			 }*/
			/*	const { x, y } = getNegativeSymbolLocation(panel)
			 ctx.lineTo(x, y)
			 const { x: x2, y: y2 } = getPositiveSymbolLocation(panel)
			 ctx.moveTo(x2, y2)*/
			// ctx.lineTo(panel.location.x, panel.location.y)
		})
		const lastPanel = linksInOrder[linksInOrder.length - 1].negativePanel
		assertNotNull(lastPanel, 'lastPanel')
		const { x: lastX, y: lastY } = customIds.includes(lastPanel.id)
			? getNegativeSymbolLocation(
					customEntities?.find((entity) => entity.id === lastPanel.id) as CanvasPanel,
			  )
			: getNegativeSymbolLocation(lastPanel)
		// const { x: lastX, y: lastY } = getNegativeSymbolLocation(lastPanel)
		ctx.lineTo(lastX, lastY)
		// ctx.lineTo(lastPanel.location.x, lastPanel.location.y)
		ctx.stroke()
		ctx.restore()
	}
}

const getSymbolLocations = (panel: CanvasPanel) => {
	return [getNegativeSymbolLocation(panel), getPositiveSymbolLocation(panel)]
}

const getPositiveSymbolLocation = (panel: CanvasPanel) => {
	const x = panel.location.x + panel.width
	const y = panel.location.y + panel.height / 2
	return { x, y }
}

const getNegativeSymbolLocation = (panel: CanvasPanel) => {
	const x = panel.location.x
	const y = panel.location.y + panel.height / 2
	return { x, y }
}
