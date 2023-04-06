import { inject, Injectable } from '@angular/core'
import { ComponentElementsService, ScreenMoveService } from '@no-grid-layout/utils'
import { XyLocation } from '@shared/data-access/models'
import { FreeBlockRectModel } from '@no-grid-layout/shared'

@Injectable({
  providedIn: 'root',
})
export class ObjectPositioningService {
  private _componentElementsService = inject(ComponentElementsService)
  private _screenMoveService = inject(ScreenMoveService)

  isOtherObjectInLine(objectId: string) {
    const element = this._componentElementsService.getComponentElementRectById(objectId)
    if (!element) return []
    /*    const objectRects = this._componentElementsService.getComponentElementRectsWithId()
     .filter(rect => rect.id !== objectId)*/
    const objectRects = this._componentElementsService.elements.filter(ele => ele.id !== objectId)

    const elementsInLine = objectRects
      /*      .map(objectRect => {
       const rect = this._componentElementsService.gridLayoutElement.getBoundingClientRect()
       // console.log('offLeftDiff', this._gridLayoutElement.offsetLeft - rect.left)
       // console.log('offTopDiff', this._gridLayoutElement.offsetTop - rect.top)
       const left = (objectRect.x - this._componentElementsService.gridLayoutElement.offsetLeft + rect.left)
       * this._screenMoveService.scale
       const top = (objectRect.y - this._componentElementsService.gridLayoutElement.offsetTop + rect.top)
       * this._screenMoveService.scale
       return {
       id:   objectRect.id,
       left: left,
       top:  top,
       }
       })*/
      .map(objectRect => this.getBlockRectFromElement(objectRect))
      .filter(rect => {
        // const rect = objectRect.getBoundingClientRect()
        // const panelRectsToCheck = gridBlockRects.filter(
        //   (rect) =>
        return element.x >= rect.x - rect.width / 2 &&
               element.x <= rect.x + rect.width / 2 &&
               element.y > rect.y
        // )
        // return (element.top <= objectRect.top + 2 && element.top >= objectRect.top - 2)
        /*      return (element.top < objectRect.top
         && element.top + element.height > objectRect.top)
         || (element.top > objectRect.top
         && element.top < objectRect.top + objectRect.height)*/
        /*      return (element.top + element.height + 2 > objectRect.top
         && element.top - 2 < objectRect.top + objectRect.height)
         || (element.left + element.width + 2 > objectRect.left
         && element.left - 2 < objectRect.left + objectRect.width)*/

        /*      return element.left + element.width + 50 > objectRect.left
         && element.left < objectRect.left + objectRect.width + 50
         && element.top + element.height + 50 > objectRect.top
         && element.top < objectRect.top + objectRect.height + 50*/
      })
    if (elementsInLine.length > 0) {
      console.log('elementsInLine', elementsInLine[0], element)
    }
    // console.log('elementsInLine', elementsInLine)
    return elementsInLine
  }

  isOtherObjectNearby(objectId: string) {
    const element = this._componentElementsService.getComponentElementRectById(objectId)
    if (!element) return []
    const objectRects = this._componentElementsService.getComponentElementRectsWithId()
      .filter(rect => rect.id !== objectId)
    const elementsNearby = objectRects.filter(objectRect => {
      /*    return element.top + element.height + 20 > objectRect.top
       && element.top - 20 < objectRect.top + objectRect.height*/
      return element.left + element.width + 20 > objectRect.left
             && element.left - 20 < objectRect.left + objectRect.width
             && element.top + element.height + 20 > objectRect.top
             && element.top - 20 < objectRect.top + objectRect.height
    })
    // console.log('elementsNearby', elementsNearby)
    return elementsNearby
  }

  getAllElementsBetweenTwoPoints(point1: XyLocation, point2: XyLocation) {
    const objectRects = this._componentElementsService.getComponentElementRectsWithId()
    const elementsBetweenPoints = objectRects.filter(objectRect => {
      // Bottom Left To Top Right
      if (point1.x < point2.x && point1.y > point2.y) {
        // Left To Right
        if (point1.x < objectRect.left && point2.x > objectRect.left) {
          // Bottom To Top
          if (point2.y < objectRect.top && point1.y > objectRect.top) {
            console.log('Bottom Left To Top Right')
            return true
          }
        }
      }
      // Top Left To Bottom Right
      if (point1.x < point2.x && point1.y < point2.y) {
        // Left To Right
        if (point1.x < objectRect.left && point2.x > objectRect.left) {
          // Top To Bottom
          if (point1.y < objectRect.top && point2.y > objectRect.top) {
            console.log('Top Left To Bottom Right')
            return true
          }
        }
      }

      // Top Right To Bottom Left
      if (point1.x > point2.x && point1.y < point2.y) {
        // Right To Left
        if (point1.x > objectRect.left && point2.x < objectRect.left) {
          // Top To Bottom
          if (point1.y < objectRect.top && point2.y > objectRect.top) {
            console.log('Top Right To Bottom Left')
            return true
          }
        }
      }

      // Bottom Right To Top Left
      if (point1.x > point2.x && point1.y > point2.y) {
        // Right To Left
        if (point1.x > objectRect.left && point2.x < objectRect.left) {
          // Bottom To Top
          if (point2.y < objectRect.top && point1.y > objectRect.top) {
            console.log('Bottom Right To Top Left')
            return true
          }
        }
      }

      return false
    })
    console.log('elementsBetweenPoints', elementsBetweenPoints)
    return elementsBetweenPoints.map(element => element.id)
  }

  private getBlockRectFromElement(element: Element): FreeBlockRectModel {
    const id = element.getAttribute('id')
    if (!id) {
      throw new Error('id not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this._componentElementsService.canvasElement.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return {
      id,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
      // element,
    }
  }
}