import { CanvasElementService } from '@canvas/app/data-access'
import { inject, Injectable } from '@angular/core'
import {
	EventWithOffsets,
	MiddlePoint,
	Point,
	Size,
	TransformedPoint,
} from '@shared/data-access/models'
import {
	eventOffsetsToPointLocation,
	eventToPointLocation,
	getTopLeftPointFromTransformedPoint,
	singleTouchEventEndToPointLocation,
	singleTouchEventToPointLocation,
} from '@canvas/utils'
import { ENTITY_TYPE, EntityType, getEntitySize, SizeByType } from '@entities/shared'

@Injectable({
	providedIn: 'root',
})
export class DomPointService {
	private _canvasElementService = inject(CanvasElementService)

	get ctx() {
		return this._canvasElementService.ctx
	}

	get scale() {
		return this.ctx.getTransform().a
	}

	get rect() {
		return this._canvasElementService.rect
	}

	getTransformedPoint(x: number, y: number) {
		const originalPoint = new DOMPoint(x, y)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint)
	}

	getScaledTransformedPoint(x: number, y: number) {
		const originalPoint = new DOMPoint(x, y)
		const inverseTransform = this.ctx.getTransform().invertSelf()
		const scaledPoint = originalPoint.matrixTransform(inverseTransform)
		return new DOMPoint(scaledPoint.x, scaledPoint.y)
	}

	getTransformedPointFromXy(point: Point) {
		const originalPoint = new DOMPoint(point.x, point.y)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
	}

	getTransformedPointFromEvent(event: PointerEvent) {
		const point = eventToPointLocation(event)
		const originalPoint = new DOMPoint(point.x, point.y)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
	}

	getTransformedPointFromSingleTouchEvent(event: TouchEvent) {
		const point = singleTouchEventToPointLocation(event)
		const originalPoint = new DOMPoint(point.x, point.y)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
	}

	getTransformedPointFromSingleTouchEndEvent(event: TouchEvent) {
		const point = singleTouchEventEndToPointLocation(event)
		const originalPoint = new DOMPoint(point.x, point.y)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
	}

	getTransformedPointFromEventOffsets(event: EventWithOffsets) {
		const point = eventOffsetsToPointLocation(event)
		const originalPoint = new DOMPoint(point.x, point.y)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
	}

	getTransformedPointToMiddleOfObject(x: number, y: number, width: number, height: number) {
		const originalPoint = new DOMPoint(x - width / 2, y - height / 2)
		return this.ctx.getTransform().invertSelf().transformPoint(originalPoint)
	}

	getTransformedPointToMiddleOfObjectFromEvent(event: MouseEvent, type: EntityType) {
		const { x, y } = eventToPointLocation(event)
		const originalPoint = new DOMPoint(x, y)
		const transformFormedPoint = this.ctx
			.getTransform()
			.invertSelf()
			.transformPoint(originalPoint) as TransformedPoint

		const topLeft = getTopLeftPointFromTransformedPoint(transformFormedPoint, getEntitySize(type))
		/*    const adjustedTransformed = this.adjustLocationToMiddleOfObjectByType(
		 transformFormedPoint,
		 type,
		 )*/
		return {
			...transformFormedPoint,
			x: topLeft.x,
			y: topLeft.y,
		} as TransformedPoint
	}

	adjustLocationToMiddleOfObject(point: Point, size: Size): MiddlePoint {
		return {
			middleX: point.x - size.width / 2,
			middleY: point.y - size.height / 2,
		}
	}

	adjustLocationToMiddleOfObjectByType(point: Point, type: EntityType): MiddlePoint {
		switch (type) {
			case ENTITY_TYPE.PANEL:
				return this.adjustLocationToMiddleOfObject(point, SizeByType[type])
			default:
				throw new Error('adjustLocationToMiddleOfObjectByType: unknown type')
		}
	}
}
