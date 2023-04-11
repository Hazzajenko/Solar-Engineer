import {
  adjustLocationToMiddleOfObjectByType,
  eventToXyLocation,
  TransformedPoint,
} from '@design-app/feature-design-canvas'
import { EntityType } from '@design-app/shared'
import { XyLocation } from '@shared/data-access/models'

export class DomPointService {
  private _ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this._ctx = ctx
  }

  getTransformedPoint(x: number, y: number) {
    const originalPoint = new DOMPoint(x, y)
    return this._ctx.getTransform().invertSelf().transformPoint(originalPoint)
  }

  getTransformedPointFromXy(point: XyLocation) {
    const originalPoint = new DOMPoint(point.x, point.y)
    return this._ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
  }

  getTransformedPointFromEvent(event: MouseEvent) {
    const point = eventToXyLocation(event)
    const originalPoint = new DOMPoint(point.x, point.y)
    return this._ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
  }

  getTransformedPointToMiddleOfObject(x: number, y: number, width: number, height: number) {
    const originalPoint = new DOMPoint(x - width / 2, y - height / 2)
    return this._ctx.getTransform().invertSelf().transformPoint(originalPoint)
  }

  getTransformedPointToMiddleOfObjectFromEvent(event: MouseEvent, type: EntityType) {
    const { x, y } = eventToXyLocation(event)
    const middlePoint = adjustLocationToMiddleOfObjectByType({ x, y }, type)
    const originalPoint = new DOMPoint(middlePoint.middleX, middlePoint.middleY)
    return this._ctx.getTransform().invertSelf().transformPoint(originalPoint)
  }
}