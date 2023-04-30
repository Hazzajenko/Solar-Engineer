import { AppStoreService } from '../app'
import { CanvasElementService, DIV_ELEMENT, DivElementsService } from '../div-elements'
import { EntityStoreService } from '../entities'
import { SelectedStateSnapshot } from '../selected'
import { drawSelectedBox, drawSelectedStringBox } from './render-fns'
import { inject, Injectable } from '@angular/core'
import { CANVAS_COLORS, CanvasEntity, PANEL_STROKE_STYLE } from '@design-app/shared'
import { isPanel } from '@design-app/utils'
import { shadeColor } from '@shared/utils'


export type CanvasRenderOptions = {
	drawFns?: ((ctx: CanvasRenderingContext2D) => void)[]
	excludedEntityIds?: string[]
	shouldRenderSelectedEntitiesBox?: boolean
	shouldRenderSelectedStringBox?: boolean
}

@Injectable({
	providedIn: 'root',
})
export class RenderService {
	private _canvasElementService = inject(CanvasElementService)
	private _divElements = inject(DivElementsService)
	private _entities = inject(EntityStoreService)
	private _app = inject(AppStoreService)

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

	get entities() {
		return this._entities.panels.getEntities()
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
		const { selectedSnapshot } = this._app.allSnapshots
		this.render((ctx) => {
			ctx.save()
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			const excludedIds = options?.excludedEntityIds
			const entities = excludedIds
				? this.entities.filter((entity) => {
						return !excludedIds.includes(entity.id)
				  })
				: this.entities
			entities.forEach((entity) => {
				/**
				 * Draw Entity
				 */

				if (!isPanel(entity)) return
				let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
				const strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT
				const { pointer } = this._app.appCtx

				const isSelected =
					selectedSnapshot.matches('EntitySelectedState.EntitiesSelected') &&
					selectedSnapshot.context.multipleSelectedIds.includes(entity.id)
				if (isSelected) {
					fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
				}

				const isStringSelected =
					selectedSnapshot.matches('StringSelectedState.StringSelected') &&
					selectedSnapshot.context.selectedStringId === entity.stringId
				if (isStringSelected) {
					fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
				}

				const isBeingHovered = !!pointer.hoveringEntityId && pointer.hoveringEntityId === entity.id
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
			/*		const { shouldRenderSelectedEntitiesBox, shouldRenderSelectedStringBox } =
			 (options?.shouldRenderSelectedEntitiesBox !== undefined && options?.shouldRenderSelectedStringBox !== undefined)
			 ? { shouldRenderSelectedEntitiesBox: options.shouldRenderSelectedEntitiesBox, shouldRenderSelectedStringBox: options.shouldRenderSelectedStringBox}
			 : { shouldRenderSelectedEntitiesBox: true, shouldRenderSelectedStringBox: true }*/

			if (
				shouldRenderSelectedEntitiesBox &&
				selectedSnapshot.matches('EntitySelectedState.EntitiesSelected')
			) {
				drawSelectedBox(
					ctx,
					this._entities.panels.getEntitiesByIds(this._app.selectedCtx.multipleSelectedIds),
				)
			}

			if (
				shouldRenderSelectedStringBox &&
				selectedSnapshot.matches('StringSelectedState.StringSelected')
			) {
				drawSelectedStringBox(ctx, selectedSnapshot, this._entities)
				drawSelectedBox(
					ctx,
					this._entities.panels.getEntitiesByIds(this._app.selectedCtx.multipleSelectedIds),
				)
			}

			if (options?.drawFns) {
				options.drawFns.forEach((fn) => fn(ctx))
			}
		})
	}

	private drawEntity(entity: CanvasEntity, selectedSnapshot: SelectedStateSnapshot) {
		if (!isPanel(entity)) return
		let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
		const strokeStyle: string = PANEL_STROKE_STYLE.DEFAULT
		const { pointer } = this._app.appCtx

		const isSelected =
			selectedSnapshot.matches('EntitySelectedState.EntitiesSelected') &&
			selectedSnapshot.context.multipleSelectedIds.includes(entity.id)
		if (isSelected) {
			fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		}

		const isStringSelected =
			selectedSnapshot.matches('StringSelectedState.StringSelected') &&
			selectedSnapshot.context.selectedStringId === entity.stringId
		if (isStringSelected) {
			fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
		}

		const isBeingHovered = !!pointer.hoveringEntityId && pointer.hoveringEntityId === entity.id
		if (isBeingHovered) {
			fillStyle = '#17fff3'
			if (isStringSelected) {
				fillStyle = shadeColor(CANVAS_COLORS.StringSelectedPanelFillStyle, 50)
			}
		}

		this.ctx.save()
		this.ctx.fillStyle = fillStyle
		this.ctx.strokeStyle = strokeStyle
		this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		this.ctx.rotate(entity.angle)
		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}
}