import { TypeOfEntity } from '@design-app/feature-selected'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasActions } from '../store/canvas'
import { CanvasEntity } from '../types'
import { assertNotNull } from '@shared/utils'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesService } from './canvas-entities'
import { eventToXyLocation } from '../functions'

@Injectable({
  providedIn: 'root',
})
export class CanvasSelectedService {
  private _entitiesStore = inject(CanvasEntitiesService)
  private _store = inject(Store)
  private _domPointService = inject(DomPointService)
  private _canvasEntitiesService = inject(CanvasEntitiesService)
  private _selected: TypeOfEntity | undefined
  private _multiSelected: CanvasEntity[] = []
  public isMultiSelectDragging = false
  draggingEntityLocations: {
    id: string
    x: number
    y: number
  }[] = []
  draggingEntityLocationsMap: Map<string, {
    x: number;
    y: number
  }> = new Map()
  draggingEntityLocationsObject: {
    [key: string]: {
      x: number;
      y: number
    }
  } = {}

  private _offsetsFromMultiSelectCenter: {
    id: string
    x: number
    y: number
  }[] = []
  multiSelectStart: {
    x: number;
    y: number
  } | undefined

  get selected() {
    return this._selected
  }

  get multiSelected() {
    return this._multiSelected
  }

  get offsetsFromMultiSelectCenter() {
    return this._offsetsFromMultiSelectCenter
  }

  set offsetsFromMultiSelectCenter(offsetsFromMultiSelectCenter: {
    id: string
    x: number
    y: number
  }[]) {
    this._offsetsFromMultiSelectCenter = offsetsFromMultiSelectCenter
    console.log('set offsetsFromMultiSelectCenter', offsetsFromMultiSelectCenter)
  }

  emitDraw = () => this._store.dispatch(CanvasActions.drawCanvas())

  startMultiSelectDragging(event: MouseEvent, scaleFactor: number) {
    if (this._multiSelected.length === 0) return
    if (!event.shiftKey) return
    this.isMultiSelectDragging = true
    this.multiSelectStart = eventToXyLocation(event)
    // const { x, y } = eventToXyLocation(event)
    // this.multiSelectStart = this._domPointService.getScaledTransformedPoint(x, y)
    // this.multiSelectStart = this._domPointService.getTransformedPointFromEvent(event)
    this.offsetsFromMultiSelectCenter = this.multiSelected.map(entity => {
      assertNotNull(this.multiSelectStart)
      // const location = this._domPointService.getScaledTransformedPoint(entity.location.x, entity.location.y)
      const location = this._domPointService.getTransformedPointFromXy(entity.location)
      // const location = entity.location
      // const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, entity.type)
      // const location = this._domPointService.getTransformedPointFromXy(entity.location)
      /*      const xDistance = Math.abs(this.multiSelectStart.x - (location.x + entity.width / 2))
       const yDistance = Math.abs(this.multiSelectStart.y - (location.y + entity.height / 2))*/
      /*      const xDistance = this.multiSelectStart.x - (location.x + entity.width / 2)
       const yDistance = this.multiSelectStart.y - (location.y + entity.height / 2)*/
      /*      const scaledX1 = location.x * scaleFactor
       const scaledY1 = location.y * scaleFactor
       const scaledX2 = this.multiSelectStart.x * scaleFactor
       const scaledY2 = this.multiSelectStart.y * scaleFactor*/
      // const distance = Math.sqrt(Math.pow(scaledX2 - scaledX1, 2) + Math.pow(scaledY2 - scaledY1, 2));
      // const xDistance = this.multiSelectStart.x - (location.x + entity.width / 2)
      const xDistance = (location.x) - this.multiSelectStart.x
      const yDistance = (location.y) - this.multiSelectStart.y
      // const xDistance = scaledX1 - scaledX2
      // const yDistance = scaledY1 - scaledY2
      /*      const x = roundToTwoDecimals(xDistance)
       const y = roundToTwoDecimals(yDistance)*/
      const x = xDistance
      const y = yDistance
      // const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
      return {
        id: entity.id,
        x,
        y,
      }
    })
  }

  onMultiDragging(event: MouseEvent) {
    assertNotNull(this.multiSelectStart)
    const eventLocation = eventToXyLocation(event)
    // const eventLocation = this._domPointService.getTransformedPointFromEvent(event)
    const scale = this._domPointService.scale
    const offset = {
      x: eventLocation.x - this.multiSelectStart.x,
      y: eventLocation.y - this.multiSelectStart.y,
    }
    console.log('offset', offset)
    offset.x = offset.x / scale
    offset.y = offset.y / scale
    console.log('offset', offset)
    this.multiSelected.forEach(entity => {
      const location = entity.location
      // const location = this._domPointService.getScaledTransformedPoint(entity.location.x, entity.location.y)
      // const location = this._domPointService.getTransformedPointFromXy(entity.location)
      // const entityOffsetToMouse = this.offsetsFromMultiSelectCenter.find(offset => offset.id === entity.id)
      // assertNotNull(entityOffsetToMouse)
      assertNotNull(this.multiSelectStart)

      /*       const newLocation = {
       x: this._selected.multiSelectStart.x + offset.x + entityOffsetToMouse.x,
       y: this._selected.multiSelectStart.y + offset.y + entityOffsetToMouse.y,
       }*/

      const newLocation = {
        x: location.x + offset.x,
        y: location.y + offset.y,
      }

      // this.draggingEntityLocationsObject[entity.id] = newLocation
      this.draggingEntityLocationsMap.set(entity.id, newLocation)
      console.log('this.draggingEntityLocationsMap', this.draggingEntityLocationsMap)
      /*      this.draggingEntityLocations.push({
       id: entity.id,
       x:  newLocation.x,
       y:  newLocation.y,
       })*/

      // const entityUpdate = CanvasEntity.updateForStore(entity, { location: newLocation })
      // this._entitiesStore.dispatch.updateCanvasEntity(entityUpdate)

      // this.updatePanel(CanvasEntity.updateLocation(entity, newLocation))
    })
  }

  stopMultiSelectDragging(event: MouseEvent) {
    this.isMultiSelectDragging = false
    if (this.multiSelectStart) {
      // const location = this._domPointService.getTransformedPointFromEvent(event)
      // const transformedMultiSelectStart = this._domPointService.getTransformedPointFromXy(this._selected.multiSelectStart)
      /*      const offset = {
       x: location.x - this.multiSelectStart.x,
       y: location.y - this.multiSelectStart.y,
       }*/
      /*      const eventLocation = eventToXyLocation(event)
       // const eventLocation = this._domPointService.getTransformedPointFromEvent(event)
       // const scale = this._ctx.getTransform().a
       const offset = {
       x: eventLocation.x - this.multiSelectStart.x,
       y: eventLocation.y - this.multiSelectStart.y,
       }*/
      const eventLocation = eventToXyLocation(event)
      const scale = this._domPointService.scale
      const offset = {
        x: eventLocation.x - this.multiSelectStart.x,
        y: eventLocation.y - this.multiSelectStart.y,
      }
      // console.log('offset', offset)
      offset.x = offset.x / scale
      offset.y = offset.y / scale
      /*        const offset = {
       x: location.x - transformedMultiSelectStart.x,
       y: location.y - transformedMultiSelectStart.y,
       }*/
      const multiSelectedUpdated = this.multiSelected.map(entity => {
        const location = entity.location
        // const location = this._domPointService.getTransformedPointFromXy(entity.location)
        const newLocation = {
          x: location.x + offset.x,
          y: location.y + offset.y,
        }
        // let toSaveLocation = this.draggingEntityLocationsMap.get(entity.id)
        // assertNotNull(toSaveLocation)
        // toSaveLocation = this._domPointService.getTransformedPointFromXy(toSaveLocation)

        // const updatedEntity = CanvasEntity.updateLocation(entity, newLocation)
        // this.updatePanel(updatedEntity)
        const updatedEntity = CanvasEntity.updateForStore(entity, { location: newLocation })
        this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
        // entity.location = newLocation
        return {
          ...entity,
          location: newLocation,
        }
        // return updatedEntity
      })
      this.setMultiSelected(multiSelectedUpdated)
    }
    // this._selected.startMultiSelectDragging(event)
    this.multiSelectStart = undefined
    this.offsetsFromMultiSelectCenter = []
    this.draggingEntityLocationsMap.clear()
    return
  }

  // updateMulti

  setSelected(selected: TypeOfEntity) {
    if (this._selected?.id === selected.id) {
      this._selected = undefined
      console.log('set selected', undefined)
      return
    }
    this._selected = selected
    console.log('set selected', selected)
    this.emitDraw()
    // this.
    // this.emit(CanvasEvent.Draw)
  }

  setMultiSelected(multiSelected: CanvasEntity[]) {
    this._multiSelected = multiSelected
    console.log('set multiSelected', multiSelected)
  }

  addToMultiSelected(selected: CanvasEntity) {
    this._multiSelected.push(selected)
    console.log('add to multiSelected', selected)
  }

  removeFromMultiSelected(selected: CanvasEntity) {
    const index = this._multiSelected.indexOf(selected)
    if (index > -1) {
      this._multiSelected.splice(index, 1)
    }
    console.log('remove from multiSelected', selected)
  }

  clearSelected() {
    if (this._selected || this._multiSelected.length) {
      this._selected = undefined
      this._multiSelected = []
      console.log('clear selected')
      this.emitDraw()
      return
    }
  }
}