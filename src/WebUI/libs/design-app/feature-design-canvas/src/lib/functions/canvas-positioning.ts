import { CanvasPanel } from '../types/canvas-panel'
import { MiddlePoint, TransformedPoint } from '../types/location'
import { ObjectSize } from '../types/sizing'
import { EntityType } from '@design-app/shared'
import { XyLocation } from '@shared/data-access/models'


export function getXyPointFromEvent(
  event: MouseEvent,
  screenPosition: XyLocation,
  scale: number,
): XyLocation {
  return {
    x: event.pageX / scale - screenPosition.x,
    y: event.pageY / scale - screenPosition.y,
  }
}

export function getXyPointFromLocation(
  location: XyLocation,
  screenPosition: XyLocation,
  scale: number,
): XyLocation {
  return {
    x: location.x / scale - screenPosition.x,
    y: location.y / scale - screenPosition.y,
  }
}

export function getXyPointFromLocationV2(
  location: XyLocation,
  screenPosition: XyLocation,
  scale: number,
): XyLocation {
  return {
    x: location.x / scale + screenPosition.x,
    y: location.y / scale + screenPosition.y,
  }
}

export function scaleAt(point: XyLocation, scaleBy: number) {
  // at pixel coords x, y scale by scaleBy
  const scale = 1 / scaleBy
  const origin = { x: 0, y: 0 }
  origin.x = point.x - (point.x - origin.x) * scaleBy
  origin.y = point.y - (point.y - origin.y) * scaleBy
}

export function eventToXyLocation(event: MouseEvent): XyLocation {
  return { x: event.offsetX, y: event.offsetY }
}

export function adjustClickToMiddleOfObject(point: XyLocation, size: ObjectSize): XyLocation {
  return {
    x: point.x - size.width / 2,
    y: point.y - size.height / 2,
  }
}

export function adjustClickToMiddleOfObjectByType(point: XyLocation, type: EntityType): XyLocation {
  switch (type) {
    case EntityType.Panel:
      return adjustClickToMiddleOfObject(point, CanvasPanel.defaultSize)
    default:
      throw new Error('adjustClickToMiddleOfObjectByType: unknown type')
  }
}

export function adjustEventToMiddleOfObjectByType(event: MouseEvent, type: EntityType): XyLocation {
  const point = { x: event.offsetX, y: event.offsetY }
  switch (type) {
    case EntityType.Panel:
      return adjustClickToMiddleOfObject(point, CanvasPanel.defaultSize)
    default:
      throw new Error('adjustClickToMiddleOfObjectByType: unknown type')
  }
}

export function getPanelRect(ctx: CanvasRenderingContext2D, panel: CanvasPanel) {
  const panelLocation = getTransformedPointFromXy(ctx, panel.location)
  return {
    x: panelLocation.x + panel.width / 2,
    y: panelLocation.y + panel.height / 2,
    width: panel.width,
    height: panel.height,
  }
}

export function adjustLocationToMiddleOfObject(point: XyLocation, size: ObjectSize): MiddlePoint {
  return {
    middleX: point.x - size.width / 2,
    middleY: point.y - size.height / 2,
  }
}

export function adjustLocationToMiddleOfObjectByType(
  point: XyLocation,
  type: EntityType,
): MiddlePoint {
  switch (type) {
    case EntityType.Panel:
      return adjustLocationToMiddleOfObject(point, CanvasPanel.defaultSize)
    default:
      throw new Error('adjustLocationToMiddleOfObjectByType: unknown type')
  }
}

export function getTransformedPointFromXy(ctx: CanvasRenderingContext2D, point: XyLocation) {
  const originalPoint = new DOMPoint(point.x, point.y)
  return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}

export function getTransformedPointFromEvent(ctx: CanvasRenderingContext2D, event: MouseEvent) {
  const originalPoint = new DOMPoint(event.offsetX, event.offsetY)

  return ctx.getTransform().invertSelf().transformPoint(originalPoint) as TransformedPoint
}

export function areAnyEntitiesNearClick(
  ctx: CanvasRenderingContext2D,
  entities: CanvasPanel[],
  point: XyLocation,
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