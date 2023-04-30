/*
 export function getEntityRotation(entity: CanvasEntity): number {
 const dx = entity.location.x - pivotPoint.x;
 const dy = entity.location.y - pivotPoint.y;
 return (Math.atan2(dy, dx) * 180 / Math.PI) + 90; // add 90 to adjust for starting position
 }*/
import { Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import {
	AngleRadians,
	CanvasEntity,
	drawSelectionBoxBoundsCtxFnWithTranslateRotate,
	getAngleInRadiansBetweenTwoPoints,
	rotatePointOffPivot,
	SizeByType,
	TransformedPoint,
	TrigonometricBounds,
} from 'deprecated/design-app/feature-design-canvas'

export const rotate = (
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	angle: number,
): [number, number] => [
	(x1 - x2) * Math.cos(angle) - (y1 - y2) * Math.sin(angle) + x2,
	(x1 - x2) * Math.sin(angle) + (y1 - y2) * Math.cos(angle) + y2,
]

export const rotateMultipleEntitiesViaMouseViaRotatingPivot = (
	entities: CanvasEntity[],
	rotatingPivot: {
		x: number
		y: number
	},
	angle: number,
): CanvasEntity[] => {
	return entities.map((entity) => {
		const [x, y] = rotate(
			entity.location.x,
			entity.location.y,
			rotatingPivot.x,
			rotatingPivot.y,
			angle,
		)
		return {
			...entity,
			location: { x, y },
		}
	})
}

export const rotateMultipleEntitiesViaMouseViaRotatingPivot2 = (
	canvasEntities: CanvasEntity[],
	pivotPoint: Point,
	startToPivotAngle: AngleRadians,
	currentPoint: TransformedPoint,
	initialSelectionBoxBounds: TrigonometricBounds,
) => {
	if (!pivotPoint || !startToPivotAngle) throw new Error('No pivot point or start to pivot angle')

	const { x: centerX, y: centerY } = pivotPoint
	const centerAngle =
		(5 * Math.PI) / 2 + Math.atan2(currentPoint.y - centerY, currentPoint.x - centerX)
	const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
	assertNotNull(startToPivotAngle)
	const adjustedAngle = (angleInRadians - startToPivotAngle) as AngleRadians
	const entities = canvasEntities.map((entity) => {
		const entityAdjustedAngle = adjustedAngle as AngleRadians
		const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
		const { width, height } = SizeByType[entity.type]
		return {
			...entity,
			id: entity.id, // location: adjustedLocationV2,
			// angle: adjustedAngleV2 as AngleRadians, // angle: adjustedAngle,
			location: getPos,
			angle: entityAdjustedAngle, // angle: adjustedAngle,
			width,
			height,
		}
	})
	return (ctx: CanvasRenderingContext2D) => {
		ctx.save()
		ctx.translate(centerX, centerY)
		ctx.rotate(centerAngle)
		entities.forEach((entity) => {
			const angle = entity.angle
			const location = entity.location
			assertNotNull(angle)
			assertNotNull(location)

			const proper = canvasEntities.find((x) => x.id === entity.id)
			if (!proper) throw new Error('No proper entity')

			ctx.save()
			const adjustedLocation = {
				x: proper.location.x - centerX,
				y: proper.location.y - centerY,
			}
			// ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
			// ctx.rotate(angle)

			ctx.beginPath()
			ctx.rect(adjustedLocation.x, adjustedLocation.y, proper.width, proper.height)
			// ctx.rect(proper.location.x, proper.location.y, proper.width, proper.height)
			// ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
		})
		ctx.restore()
		ctx.save()
		ctx.rect(pivotPoint.x - 5, pivotPoint.y - 5, 10, 10)
		ctx.fill()
		ctx.stroke()
		ctx.restore()
		initialSelectionBoxBounds.angle = adjustedAngle
		drawSelectionBoxBoundsCtxFnWithTranslateRotate(initialSelectionBoxBounds)(ctx)
	}
}
