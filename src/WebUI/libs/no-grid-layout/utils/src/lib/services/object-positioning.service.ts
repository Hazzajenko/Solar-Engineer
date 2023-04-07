import { inject, Injectable } from '@angular/core'
import { ComponentElementsService, ScreenMoveService } from '@no-grid-layout/utils'
import { DesignRectModel, LineDirection } from '@no-grid-layout/shared'
import { XyLocation } from '@shared/data-access/models'
import { DesignPanelModel, DesignPanelsFacade } from '@design-app/feature-panel'
import { UpdateStr } from '@ngrx/entity/src/models'

@Injectable({
  providedIn: 'root',
})
export class ObjectPositioningService {
  private _componentElementsService = inject(ComponentElementsService)
  private _screenMoveService = inject(ScreenMoveService)
  private _designPanelsFacade = inject(DesignPanelsFacade)

  public moveGroupOfPanelsToSameAxisPosition(ids: string[], axis: 'x' | 'y') {
    const rects = ids.map(id => this.getBlockRectFromId(id))
    const min = Math.min(...rects.map(r => r[axis]))
    const max = Math.max(...rects.map(r => r[axis]))
    const middle = (min + max) / 2
    const offset = middle - rects[0][axis]
    // this._screenMoveService.moveScreenByOffset(axis, offset)
  }

  public async moveGroupOfPanelsToSameAxisPositionV2(ids: string[], direction: LineDirection) {
    const rects = ids.map(id => this.getBlockRectFromId(id))
    const axis = direction === 'left' || direction === 'right'
      ? 'x'
      : 'y'
    const min = Math.min(...rects.map(r => r[axis]))
    const max = Math.max(...rects.map(r => r[axis]))
    const middle = (min + max) / 2
    const offset = middle - rects[0][axis]
    console.log('moveGroupOfPanelsToSameAxisPositionV2', { ids, direction, rects, axis, min, max, middle, offset })
    const panels = await this._designPanelsFacade.panelsByIdArray(ids)
    const updates = panels.map(panel => {
        const location: XyLocation = {
          x: panel.location.x,
          y: panel.location.y,
        }
        if (direction === 'left') {
          location.x = middle
        } else if (direction === 'right') {
          location.x = middle
        } else if (direction === 'top') {
          location.y = middle
        } else if (direction === 'bottom') {
          location.y = middle
        }
        return {
          id:      panel.id,
          changes: {
            location,
          },
        } as UpdateStr<DesignPanelModel>
      },
    )
    console.log('moveGroupOfPanelsToSameAxisPositionV2', { updates })
    return this._designPanelsFacade.updateManyPanels(updates)

    /*
     const updatePanels = async () => {
     const panels = await this._designPanelsFacade.panelsByIdArray(ids)
     return panels.map(panel => {
     const location: XyLocation = {
     x: panel.location.x,
     y: panel.location.y,
     }
     if (direction === 'left') {
     location.x = middle
     } else if (direction === 'right') {
     location.x = middle
     } else if (direction === 'top') {
     location.y = middle
     } else if (direction === 'bottom') {
     location.y = middle
     }
     return {
     id:      panel.id,
     changes: {
     location,
     },
     } as UpdateStr<DesignPanelModel>
     },
     )
     }

     return updatePanels()
     .then(updates => {
     return this._designPanelsFacade.updateManyPanels(updates)
     })
     .catch(e => console.error('updatePanels', e))
     */

  }

  public getBlockRectFromId(id: string): DesignRectModel {
    const element = this._componentElementsService.getComponentElementById(id)
    if (!element) {
      throw new Error('element not found')
    }
    return this.getBlockRectFromElement(element)
  }

  private getBlockRectFromElement(element: Element): DesignRectModel {
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
}