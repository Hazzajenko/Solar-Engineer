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