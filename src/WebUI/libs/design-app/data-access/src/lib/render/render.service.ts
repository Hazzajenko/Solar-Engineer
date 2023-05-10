import { AppStateStoreService } from '../app-store'
import { CanvasElementService, DIV_ELEMENT, DivElementsService } from '../div-elements'
import { EntityStoreService } from '../entities'
import { SelectedStoreService } from '../selected'
import { CanvasRenderOptions } from './canvas-render-options'
import { drawSelectedBox, drawSelectedStringBoxV3 } from './render-fns'
import { inject, Injectable } from '@angular/core'
import { CANVAS_COLORS, PANEL_STROKE_STYLE } from '@design-app/shared'
import { isPanel } from '@design-app/utils'
import { assertNotNull, shadeColor } from '@shared/utils'

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

				const selectedState = this._selectedStore.state

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

				const isStringSelected =
					selectedState.selectedStringId && selectedState.selectedStringId === entity.stringId
				if (isStringSelected) {
					fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
				}

				const pointerState = this._appStore.state.pointer
				const hoveringOverEntityId = pointerState.hoveringOverEntityId
				const isBeingHovered = !!hoveringOverEntityId && hoveringOverEntityId === entity.id

				if (isBeingHovered) {
					fillStyle = '#17fff3'
					if (isStringSelected) {
						fillStyle = shadeColor(CANVAS_COLORS.StringSelectedPanelFillStyle, 50)
					}
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
				ctx.restore()
			})
			ctx.restore()

			const shouldRenderSelectedEntitiesBox = options?.shouldRenderSelectedEntitiesBox ?? true
			const shouldRenderSelectedStringBox = options?.shouldRenderSelectedStringBox ?? true

			const multipleSelectedEntityIds = this._selectedStore.state.multipleSelectedEntityIds
			if (shouldRenderSelectedEntitiesBox && multipleSelectedEntityIds.length) {
				drawSelectedBox(ctx, this._entities.panels.getByIds(multipleSelectedEntityIds))
			} else if (
				shouldRenderSelectedEntitiesBox &&
				this._selectedStore.state.singleSelectedEntityId
			) {
				const selectedEntity =
					this._entities.panels.entities[this._selectedStore.state.singleSelectedEntityId]
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

			if (options?.drawFns) {
				options.drawFns.forEach((fn) => fn(ctx))
			}
		})
	}
}
