import { CANVAS_COLORS } from '../types'
import { AngleRadians, EntityBounds, TrigonometricBounds, TrigonometricBoundsTuple } from '../utils'
import { Point } from '@shared/data-access/models'

export const drawSelectionBoxBoundsCtxFn = (selectionBoxBounds: {
	left: number
	top: number
	width: number
	height: number
}) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const { left, top, width, height } = selectionBoxBounds
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		ctx.strokeRect(left, top, width, height)
		ctx.restore()
	}
}

export const drawSelectionBoxBoundsCtxFnWithTranslateRotate = (
	selectionBoxBounds: TrigonometricBounds,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const { left, top, width, height, centerX, centerY } = selectionBoxBounds
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		// ctx.translate(centerX, centerY)
		ctx.translate(left + width / 2, top + height / 2)
		ctx.rotate(selectionBoxBounds.angle)
		ctx.rect(-width / 2, -height / 2, width, height)
		ctx.stroke()
		// ctx.strokeRect(left, top, width, height)
		ctx.restore()
	}
}

export const drawSelectionBoxBoundsCtxFnWithTranslateRotateFromEntityBoundsWithAngle = (
	selectionBoxBounds: EntityBounds,
	angle: AngleRadians,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const { left, top, right, bottom, centerX, centerY } = selectionBoxBounds
		const width = right - left
		const height = bottom - top
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		// ctx.translate(centerX, centerY)
		ctx.translate(left + width / 2, top + height / 2)
		ctx.rotate(angle)
		ctx.rect(-width / 2, -height / 2, width, height)
		ctx.stroke()
		// ctx.strokeRect(left, top, width, height)
		ctx.restore()
	}
}
// TrigonometricBoundsTuple
// ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
// ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)

export const drawSelectionBoxBoundsFromTupleCtxFn = (
	selectionBoxBounds: TrigonometricBoundsTuple,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const [left, top, right, bottom] = selectionBoxBounds
		const width = right - left
		const height = bottom - top
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		ctx.strokeRect(left, top, width, height)
		ctx.restore()
	}
}

export const drawSelectionBoxBoundsFromTupleCtxFnWithAngle = (
	selectionBoxBounds: TrigonometricBoundsTuple,
	angle: AngleRadians,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const [left, top, right, bottom] = selectionBoxBounds
		const width = right - left
		const height = bottom - top
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		ctx.translate(left + width / 2, top + height / 2)
		ctx.rotate(angle)
		ctx.rect(-width / 2, -height / 2, width, height)
		ctx.stroke()
		ctx.restore()
	}
}

export const drawSelectionBoxBoundsFromTupleCtxFnWithAngleGoingOffOffset = (
	selectionBoxBounds: TrigonometricBoundsTuple,
	angle: AngleRadians,
	offset: Point,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		const [left, top, right, bottom] = selectionBoxBounds
		const width = right - left
		const height = bottom - top
		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		// const x = left + width / 2 + offset.x
		ctx.translate(left + width / 2, top + height / 2)
		ctx.rotate(angle)
		ctx.rect(-width / 2, -height / 2, width, height)
		ctx.stroke()
		ctx.restore()
	}
}

export const drawSelectionBoxBoundsByDrawingLines = (
	selectionBoxBounds: TrigonometricBoundsTuple,
	angle: AngleRadians,
) => {
	return (ctx: CanvasRenderingContext2D) => {
		const [left, top, right, bottom] = selectionBoxBounds
		const width = right - left
		const height = bottom - top
		ctx.save()
		// ctx.translate(left + width / 2, top + height / 2)
		// ctx.rotate(angle)
		// ctx.save()

		ctx.strokeStyle = CANVAS_COLORS.MultiSelectedPanelFillStyle
		ctx.lineWidth = 1
		ctx.beginPath()
		// ctx.rect(-width / 2, -height / 2, width, height)
		// 		ctx.rotate(angle)
		ctx.moveTo(left, top)
		ctx.lineTo(right, top)
		ctx.lineTo(right, bottom)
		ctx.lineTo(left, bottom)
		ctx.closePath()
		ctx.stroke()
		// ctx.restore()
		ctx.restore()
	}
}
