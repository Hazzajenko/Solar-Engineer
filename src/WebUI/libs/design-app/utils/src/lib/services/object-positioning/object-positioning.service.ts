import { inject, Injectable } from '@angular/core'
import { XyLocation } from '@shared/data-access/models'
import { PanelModel, PanelsStoreService } from '@design-app/feature-panel'
import { UpdateStr } from '@ngrx/entity/src/models'
import { ComponentElementsService, DesignRectModel } from '../component-elements'
import { ViewPositioningService } from '../view-positioning'
import { LineDirection } from '@design-app/canvas'
import { TypeOfEntity } from '@design-app/feature-selected'
import { EntityType, isEntityType } from '@design-app/shared'
import { MousePositioningService } from '../mouse-positioning'

@Injectable({
  providedIn: 'root',
})
export class ObjectPositioningService {
  private _componentElementsService = inject(ComponentElementsService)
  private _viewPositioningService = inject(ViewPositioningService)
  private _mousePositioningService = inject(MousePositioningService)
  private _panelsStore = inject(PanelsStoreService)
  // private _designPanelsFacade = inject(DesignPanelsFacade)
  private _nearByEntitiesOnAxis: { [key in EntityType]: { [key in LineDirection]: string[] } } = {
    panel:  {
      left:   [],
      right:  [],
      top:    [],
      bottom: [],
    },
    string: {
      left:   [],
      right:  [],
      top:    [],
      bottom: [],
    },
  }

  public pushEntityToNearByEntitiesOnAxis(entity: TypeOfEntity, direction: LineDirection) {
    this._nearByEntitiesOnAxis[entity.type][direction].includes(entity.id)
    || this._nearByEntitiesOnAxis[entity.type][direction].push(entity.id)
  }

  public getNearByEntitiesOnAxis(entity: TypeOfEntity, direction: LineDirection) {
    return this._nearByEntitiesOnAxis[entity.type][direction]
  }

  public selectBiggestNearByEntityArray(type: EntityType) {
    const { left, right, top, bottom } = this._nearByEntitiesOnAxis[type]
    const result = [left, right, top, bottom].sort((a, b) => b.length - a.length)[0]
    switch (result) {
      case left:
        return {
          ids:       result,
          direction: LineDirection.Left,
        }
      case right:
        return {
          ids:       result,
          direction: LineDirection.Right,
        }
      case top:
        return {
          ids:       result,
          direction: LineDirection.Top,
        }
      case bottom:
        return {
          ids:       result,
          direction: LineDirection.Bottom,
        }
      default:
        throw new Error('No direction found')

    }
  }

  public clearNearByEntitiesOnAxis(type: EntityType, direction: LineDirection) {
    this._nearByEntitiesOnAxis[type][direction] = []
  }

  public moveGroupOfPanelsToSameAxisPosition(ids: string[], axis: 'x' | 'y') {
    const rects = ids.map(id => this.getBlockRectFromId(id))
    const min = Math.min(...rects.map(r => r[axis]))
    const max = Math.max(...rects.map(r => r[axis]))
    const middle = (min + max) / 2
    const offset = middle - rects[0][axis]
    // this._screenMoveService.moveScreenByOffset(axis, offset)
  }

  public moveGroupOfPanelsToSameAxisPositionV2(ids: string[], direction: LineDirection) {
    // const rects = ids.map(id => this.getBlockRectFromId(id))
    const rects = this._componentElementsService.getElementRectsByIdArray(ids)
    const axis = direction === LineDirection.Left || direction === LineDirection.Right
      ? 'x'
      : 'y'
    const min = Math.min(...rects.map(r => r[axis]))
    const max = Math.max(...rects.map(r => r[axis]))
    const middle = (min + max) / 2
    const offset = middle - rects[0][axis]
    console.log('moveGroupOfPanelsToSameAxisPositionV2', { ids, direction, rects, axis, min, max, middle, offset })
    // const panels = await this._designPanelsFacade.panelsByIdArray(ids)
    // const panels = this._componentElementsService.getElementRectsByIdArray(ids)
    const updates = rects.map(panel => {
        const location: XyLocation = {
          x: panel.x,
          y: panel.y,
        }
        // location = this._mousePositioningService.getMousePositionFromXYWithSize(location)
        if (direction === LineDirection.Left) {
          location.x = middle
        } else if (direction === LineDirection.Right) {
          location.x = middle
        } else if (direction === LineDirection.Top) {
          location.y = middle
        } else if (direction === LineDirection.Bottom) {
          location.y = middle
        }
        return {
          id:      panel.id,
          changes: {
            location,
          },
        } as UpdateStr<PanelModel>
      },
    )
    console.log('moveGroupOfPanelsToSameAxisPositionV2', { updates })
    return this._panelsStore.dispatch.updateManyPanels(updates)
  }

  /*
   public moveGroupOfPanelsToSameAxisPositionV3(ids: string[]) {
   // const rects = ids.map(id => this.getBlockRectFromId(id))
   const rects = this._componentElementsService.getElementRectsByIdArray(ids)
   const left = Math.min(...rects.map(r => r.x))
   const right = Math.max(...rects.map(r => r.x))
   const top = Math.min(...rects.map(r => r.y))
   const bottom = Math.max(...rects.map(r => r.y))
   const middleX = (left + right) / 2
   const middleY = (top + bottom) / 2
   // const offset = middleX - rects[0].x
   //     const closestAxis = this.getClosestAxis(middleX, middleY)

   // const offset = middleX - rects[0].x


   const axis = direction === LineDirection.Left || direction === LineDirection.Right
   ? 'x'
   : 'y'
   const min = Math.min(...rects.map(r => r[axis]))
   const max = Math.max(...rects.map(r => r[axis]))
   const middle = (min + max) / 2
   const offset = middle - rects[0][axis]
   console.log('moveGroupOfPanelsToSameAxisPositionV2', { ids, direction, rects, axis, min, max, middle, offset })
   // const panels = await this._designPanelsFacade.panelsByIdArray(ids)
   // const panels = this._componentElementsService.getElementRectsByIdArray(ids)
   const updates = rects.map(panel => {
   const location: XyLocation = {
   x: panel.x,
   y: panel.y,
   }
   // location = this._mousePositioningService.getMousePositionFromXYWithSize(location)
   if (direction === LineDirection.Left) {
   location.x = middle
   } else if (direction === LineDirection.Right) {
   location.x = middle
   } else if (direction === LineDirection.Top) {
   location.y = middle
   } else if (direction === LineDirection.Bottom) {
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
   }*/

  /*  private getClosestAxis(x: number, y: number): 'x' | 'y' {
   const xDistance = Math.abs(x - this._designStateService.designState.center.x)
   const yDistance = Math.abs(y - this._designStateService.designState.center.y)
   return xDistance < yDistance ? 'x' : 'y'
   }*/

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
    const type = element.getAttribute('type')
    if (!type || !isEntityType(type)) {
      throw new Error('type not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this._componentElementsService.canvasElement.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return {
      id,
      type,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
      // element,
    }
  }

  getAllElementsBetweenTwoPoints(point1: XyLocation, point2: XyLocation): TypeOfEntity[] {
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
    return elementsBetweenPoints.map(element => ({
      id:   element.id,
      type: element.type,
    }))
  }

}