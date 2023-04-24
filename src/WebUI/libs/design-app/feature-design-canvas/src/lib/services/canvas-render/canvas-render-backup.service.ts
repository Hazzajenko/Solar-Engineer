import { inject, Injectable } from '@angular/core'
import { CanvasElementService } from '../canvas-element.service'
import { CANVAS_COLORS, CanvasEntity, EntityLocation, isPanel, SizeByType } from '../../types'
import { DomPointService } from '../dom-point.service'
import { CanvasAppStateStore } from '../canvas-app-state'
import { assertNotNull } from '@shared/utils'
import { CANVAS_MODE, canvasAppXStateService, CanvasClientStateService, MultipleToMove, SingleToMove } from '../canvas-client-state'
import { getAllAvailableEntitySpotsBetweenTwoPoints } from '../../utils'
import { DIV_ELEMENT, DivElementsService } from '../div-elements'

@Injectable({
	providedIn: 'root',
})
export class CanvasRenderBackupService {
	private _canvasElementService = inject(CanvasElementService)
	private _domPointService = inject(DomPointService)
	private _appState = inject(CanvasAppStateStore)
	private _divElements = inject(DivElementsService)
	private _state = inject(CanvasClientStateService)

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
		return this._state.entities.canvasEntities.getEntities()
	}

	get fpsEl() {
		return this._divElements.getElementById(DIV_ELEMENT.FPS)
	}

	checkFps() {
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

	render(fn: (ctx: CanvasRenderingContext2D) => void) {
		this.framesThisSecond++
		this.ctx.save()
		fn(this.ctx)
		this.ctx.restore()
	}

	drawCanvas() {
		this.render((ctx) => {
			ctx.save()
			ctx.setTransform(1, 0, 0, 1, 0, 0)
			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
			ctx.restore()
			ctx.save()
			ctx.beginPath()
			const entities = this._state.entities.canvasEntities.getEntities()
			entities.forEach((entity) => {
				this.drawEntity(entity)
			})
			ctx.restore()
		})
	}

	drawCanvasWithFunction(fn: (ctx: CanvasRenderingContext2D) => void) {
		this.render((ctx) => {
			ctx.save()
			this.drawCanvas()
			fn(ctx)
			ctx.restore()
		})
	}

	drawDragBox(event: MouseEvent) {
		const start = this._state.state.dragBox.dragBoxStart
		if (!start) {
			console.log('drawDragBox', 'no start')
			return
		}

		const { mode } = this._state.mode
		const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
		const width = currentPoint.x - start.x
		const height = currentPoint.y - start.y
		this.drawCanvas()
		this.ctx.save()
		this.ctx.beginPath()
		this.ctx.globalAlpha = 0.4
		this.ctx.strokeStyle = mode === CANVAS_MODE.SELECT
			? CANVAS_COLORS.SelectionBoxFillStyle
			: CANVAS_COLORS.CreationBoxFillStyle
		this.ctx.lineWidth = 1
		this.ctx.rect(start.x, start.y, width, height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.closePath()
		this.ctx.restore()

		if (mode !== CANVAS_MODE.CREATE) return
		const spots = getAllAvailableEntitySpotsBetweenTwoPoints(start, currentPoint, this.entities)
		if (!spots) return

		const { type } = this._state.mode
		const entitySize = SizeByType[type]

		this.ctx.save()
		spots.forEach(spot => {
			this.ctx.save()
			this.ctx.beginPath()
			this.ctx.globalAlpha = 0.4
			this.ctx.fillStyle = spot.vacant
				? CANVAS_COLORS.PreviewPanelFillStyle
				: CANVAS_COLORS.TakenSpotFillStyle
			this.ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
			this.ctx.fill()
			this.ctx.stroke()
			this.ctx.restore()
		})
		this.ctx.restore()
	}

	private drawEntity(entity: CanvasEntity) {
		let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
		const { toMove, toRotate, selected, hover } = this._state.state
		// const isBeingHovered = canvasAppXStateService.getSnapshot().context.selected
		// const isBeingHovered = canvasAppXStateService.getSnapshot().matches('DragBoxState.DragBoxInProgress')
		const isBeingHovered = !!hover.hoveringEntityId && hover.hoveringEntityId === entity.id
		if (isBeingHovered) {
			fillStyle = '#17fff3'
		}

		const inSingleSelectedState = canvasAppXStateService.getSnapshot()
			.matches('SelectedState.EntitySelected')
		const isSingleSelected = canvasAppXStateService.getSnapshot().context.selected.singleSelectedId === entity.id

		// const isSingleSelected = !!selected.singleSelectedId && selected.singleSelectedId === entity.id

		if (isSingleSelected && inSingleSelectedState) {
			fillStyle = CANVAS_COLORS.SelectedPanelFillStyle
		}

		const isMultiSelected = selected.multipleSelectedIds.includes(entity.id)

		if (isMultiSelected) {
			fillStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		}

		if (isPanel(entity)) {
			const isStringSelected = selected.selectedStringId === entity.stringId
			if (isStringSelected && selected.selectedStringId && entity.stringId) {
				fillStyle = CANVAS_COLORS.StringSelectedPanelFillStyle
			}
		}

		const multipleToRotate = toRotate.multipleToRotate
		const isInMultiRotate = !!multipleToRotate && multipleToRotate.ids.includes(entity.id)
		if (isInMultiRotate) {
			this.handleMultipleRotationDraw(entity)
			return
		}

		const isInSingleRotate = !!toRotate.singleToRotate && toRotate.singleToRotate.id === entity.id
		if (isInSingleRotate) {
			this.handleSingleRotationDraw(entity)
			return
		}

		if (isSingleDragging(entity, toMove.singleToMove)) {
			this.handleDraggingEntityDraw(entity, toMove.singleToMove)
			return
		}

		if (isMultipleDragging(entity, toMove.multipleToMove)) {
			this.handleMultipleMoveDraw(entity, toMove.multipleToMove)
			return
		}

		const nearbyEntityIds = this._state.nearby.ids
		const isNearby = nearbyEntityIds.includes(entity.id)
		if (isNearby) {
			fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
		}

		this.ctx.save()
		this.ctx.fillStyle = fillStyle
		this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		this.ctx.rotate(entity.angle)
		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleDraggingEntityDraw(entity: CanvasEntity, singleToMove: EntityLocation) {
		this.ctx.save()
		this.ctx.fillStyle = CANVAS_COLORS.HoveredPanelFillStyle
		this.ctx.translate(singleToMove.location.x + entity.width / 2, singleToMove.location.y + entity.height / 2)
		this.ctx.rotate(entity.angle)

		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleMultipleMoveDraw(entity: CanvasEntity, multipleToMove: MultipleToMove) {
		const offset = multipleToMove.offset
		this.ctx.save()
		this.ctx.translate(entity.location.x + entity.width / 2 + offset.x, entity.location.y + entity.height / 2 + offset.y)
		this.ctx.rotate(entity.angle)

		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleSingleRotationDraw(entity: CanvasEntity) {
		const singleToRotate = this._state.toRotate.singleToRotate
		assertNotNull(singleToRotate)
		const angle = singleToRotate.adjustedAngle

		assertNotNull(angle, 'angle should not be null')

		this.ctx.save()
		this.ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
		this.ctx.rotate(angle)
		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

	private handleMultipleRotationDraw(entity: CanvasEntity) {
		const multipleToRotate = this._state.toRotate.multipleToRotate
		assertNotNull(multipleToRotate)
		const angle = multipleToRotate.adjustedAngle
		const location = multipleToRotate.entities.find((e) => e.id === entity.id)?.adjustedLocation
		assertNotNull(angle)
		assertNotNull(location)

		this.ctx.save()
		this.ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
		this.ctx.rotate(angle)

		this.ctx.beginPath()
		this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
		this.ctx.fill()
		this.ctx.stroke()
		this.ctx.restore()
	}

}

const isSingleDragging = (entity: CanvasEntity, singleToMove: SingleToMove | undefined): singleToMove is SingleToMove => {
	return !!singleToMove && singleToMove.id === entity.id
}

const isMultipleDragging = (entity: CanvasEntity, multipleToMove: MultipleToMove | undefined): multipleToMove is MultipleToMove => {
	return !!multipleToMove && multipleToMove.entities.find((e) => e.id === entity.id) !== undefined
}
