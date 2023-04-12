import { CanvasEntity } from '../types/canvas-entity'
import { TransformedPoint } from '../types/location'
import { getEntitySizeOffset } from './object-sizing'

export function getAllElementsBetweenTwoPoints(
  array: CanvasEntity[],
  point1: TransformedPoint,
  point2: TransformedPoint,
) {
  // const objectRects = this._componentElementsService.getComponentElementRectsWithId()
  const elementsBetweenPoints = array.filter((objectRect) => {
    // const widthOffset
    const { widthOffset, heightOffset } = getEntitySizeOffset(objectRect)
    // Bottom Left To Top Right
    if (point1.x < point2.x && point1.y > point2.y) {
      // Left To Right
      if (point1.x < objectRect.location.x && point2.x > objectRect.location.x + widthOffset) {
        // Bottom To Top
        if (point2.y < objectRect.location.y && point1.y > objectRect.location.y + heightOffset) {
          console.log('Bottom Left To Top Right')
          return true
        }
      }
    }
    // Top Left To Bottom Right
    if (point1.x < point2.x && point1.y < point2.y) {
      // Left To Right
      if (point1.x < objectRect.location.x && point2.x > objectRect.location.x + widthOffset) {
        // Top To Bottom
        if (point1.y < objectRect.location.y && point2.y > objectRect.location.y + heightOffset) {
          console.log('Top Left To Bottom Right')
          return true
        }
      }
    }

    // Top Right To Bottom Left
    if (point1.x > point2.x && point1.y < point2.y) {
      // Right To Left
      if (point1.x > objectRect.location.x + widthOffset && point2.x < objectRect.location.x) {
        // Top To Bottom
        if (point1.y < objectRect.location.y + heightOffset && point2.y > objectRect.location.y) {
          console.log('Top Right To Bottom Left')
          return true
        }
      }
    }

    // Bottom Right To Top Left
    if (point1.x > point2.x && point1.y > point2.y) {
      // Right To Left
      if (point1.x > objectRect.location.x + widthOffset && point2.x < objectRect.location.x) {
        // Bottom To Top
        if (point2.y < objectRect.location.y + heightOffset && point1.y > objectRect.location.y) {
          console.log('Bottom Right To Top Left')
          return true
        }
      }
    }

    return false
  })
  console.log('elementsBetweenPoints', elementsBetweenPoints)
  return elementsBetweenPoints
  /*  return elementsBetweenPoints.map((element) => ({
   id: element.id,
   type: element.type,
   }))*/
}