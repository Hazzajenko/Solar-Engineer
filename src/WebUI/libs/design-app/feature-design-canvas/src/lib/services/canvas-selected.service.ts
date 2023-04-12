import { TypeOfEntity } from '@design-app/feature-selected'
import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasActions } from '../store/canvas'
import { CanvasEntity } from '../types'
import { assertNotNull } from '@shared/utils'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesService } from './canvas-entities'

@Injectable({
  providedIn: 'root',
})
export class CanvasSelectedService {
  private _store = inject(Store)
  private _domPointService = inject(DomPointService)
  private _canvasEntitiesService = inject(CanvasEntitiesService)
  private _selected: TypeOfEntity | undefined
  private _multiSelected: CanvasEntity[] = []
  public isMultiSelectDragging = false
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

  startMultiSelectDragging(event: MouseEvent) {
    if (this._multiSelected.length === 0) return
    if (!event.shiftKey) return
    this.isMultiSelectDragging = true
    this.multiSelectStart = this._domPointService.getTransformedPointFromEvent(event)
    this.offsetsFromMultiSelectCenter = this.multiSelected.map(entity => {
      assertNotNull(this.multiSelectStart)
      const location = this._domPointService.getTransformedPointFromXy(entity.location)
      // const location = this._domPointService.getTransformedPointFromXy(entity.location)
      const xDistance = Math.abs(this.multiSelectStart.x - (location.x + entity.width / 2))
      const yDistance = Math.abs(this.multiSelectStart.y - (location.y + entity.height / 2))
      // const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
      return {
        id: entity.id,
        x:  xDistance,
        y:  yDistance,
      }
    })
  }

  stopMultiSelectDragging(event: MouseEvent) {
    this.isMultiSelectDragging = false
    if (this.multiSelectStart) {
      const location = this._domPointService.getTransformedPointFromEvent(event)
      const offset = {
        x: location.x - this.multiSelectStart.x,
        y: location.y - this.multiSelectStart.y,
      }
      const multiSelectedUpdated = this.multiSelected.map(entity => {
        const location = this._domPointService.getTransformedPointFromXy(entity.location)
        const newLocation = {
          x: location.x + offset.x,
          y: location.y + offset.y,
        }
        const updatedEntity = CanvasEntity.updateForStore(entity, { location: newLocation })
        // this.updatePanel(updatedEntity)
        this._canvasEntitiesService.dispatch.updateCanvasEntity(updatedEntity)
        entity.location = newLocation
        return entity
      })
      this.setMultiSelected(multiSelectedUpdated)
    }
    this.multiSelectStart = undefined
    this.offsetsFromMultiSelectCenter = []
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