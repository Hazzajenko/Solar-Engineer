import { CanvasEntity, MiddlePoint, ObjectSize, TransformedPoint } from '../types'
import { Point } from '@shared/data-access/models'

export function getXyPointFromEvent(
  event: MouseEvent,
  screenPosition: Point,
  scale: number,
): Point {
  return {
    x: event.pageX / scale - screenPosition.x,
    y: event.pageY / scale - screenPosition.y,
  }
}

export function getXyPointFromLocation(
  location: Point,
  screenPosition: Point,
  scale: number,
): Point {
  return {
    x: location.x / scale - screenPosition.x,
    y: location.y / scale - screenPosition.y,
  }
}

export function getXyPointFromLocationV2(
  location: Point,
  screenPosition: Point,
  scale: number,
): Point {
  return {
    x: location.x / scale + screenPosition.x,
    y: location.y / scale + screenPosition.y,
  }
}

export function scaleAt(point: Point, scaleBy: number) {
  // at pixel coords x, y scale by scaleBy
  const scale = 1 / scaleBy
  const origin = { x: 0, y: 0 }
  origin.x = point.x - (point.x - origin.x) * scaleBy
  origin.y = point.y - (point.y - origin.y) * scaleBy
}

export function eventToPointLocation(event: MouseEvent): Point {
  return { x: event.offsetX, y: event.offsetY }
}

export function adjustClickToMiddleOfObject(point: Point, size: ObjectSize): Point {
  return {
    x: point.x - size.width / 2,
    y: point.y - size.height / 2,
  }
}

/*export function adjustClickToMiddleOfObjectByType(point: XyLocation, type: EntityType): XyLocation {
 switch (type) {
 case EntityType.Panel:
 return adjustClickToMiddleOfObject(point, CanvasEntity.defaultSize)
 default:
 throw new Error('adjustClickToMiddleOfObjectByType: unknown type')
 }
 }*/

/*
 export function adjustEventToMiddleOfObjectByType(event: MouseEvent, type: EntityType): XyLocation {
 const point = { x: event.offsetX, y: event.offsetY }
 switch (type) {
 case EntityType.Panel:
 return adjustClickToMiddleOfObject(point, CanvasEntity.defaultSize)
 default:
 throw new Error('adjustClickToMiddleOfObjectByType: unknown type')
 }
 }
 */

export function getPanelRect(ctx: CanvasRenderingContext2D, panel: CanvasEntity) {
  const panelLocation = getTransformedPointFromXy(ctx, panel.location)
  return {
    x: panelLocation.x + panel.width / 2,
    y: panelLocation.y + panel.height / 2,
    width: panel.width,
    height: panel.height,
  }
}

export function adjustLocationToMiddleOfObject(point: Point, size: ObjectSize): MiddlePoint {
  return {
    middleX: point.x - size.width / 2,
    middleY: point.y - size.height / 2,
  }
}

/*
 export function adjustLocationToMiddleOfObjectByType(
 point: XyLocation,
 type: EntityType,
 ): MiddlePoint {
 switch (type) {
 case EntityType.Panel:
 return adjustLocationToMiddleOfObject(point, CanvasEntity.defaultSize)
 default:
 throw new Error('adjustLocationToMiddleOfObjectByType: unknown type')
 }
 }
 */

export function getTransformedPointFromXy(ctx: CanvasRenderingContext2D, point: Point) {
  const originalPoint = new DOMPoint(point.x, point.y)
  return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}

export function getTransformedPointFromEvent(ctx: CanvasRenderingContext2D, event: MouseEvent) {
  const originalPoint = new DOMPoint(event.offsetX, event.offsetY)

  return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}

export function areAnyEntitiesNearClick(
  ctx: CanvasRenderingContext2D,
  entities: CanvasEntity[],
  point: Point,
) {
  const panelsNearClick = entities.filter((panel) => {
    const panelRect = getPanelRect(ctx, panel)
    const nearLeft = panelRect.x - panelRect.width / 2 <= point.x + 10
    const nearRight = panelRect.x + panelRect.width / 2 >= point.x - 10
    const nearTop = panelRect.y - panelRect.height / 2 <= point.y + 10
    const nearBottom = panelRect.y + panelRect.height / 2 >= point.y - 10
    return nearLeft && nearRight && nearTop && nearBottom
  })
  return panelsNearClick.length > 0
}