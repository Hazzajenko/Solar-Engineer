import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasActions } from '../store'
import { CanvasEntity, CanvasPanel, CanvasString, EntityFactory, SELECTED_TYPE, SelectedType } from '../types'
import { assertNotNull } from '@shared/utils'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { eventToXyLocation } from '../functions'

@Injectable({
  providedIn: 'root',
})
export class CanvasSelectedService {
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _store = inject(Store)
  private _domPointService = inject(DomPointService)
  private _canvasEntitiesService = inject(CanvasEntitiesStore)
  private _selected: CanvasEntity | undefined
  private _selectedType: SelectedType | undefined
  private _selectedStringId: CanvasString['id'] | undefined
  private _multiSelected: CanvasEntity[] = []
  public isMultiSelectDragging = false

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

  get selectedType() {
    return this._selectedType
  }

  get selectedStringId() {
    return this._selectedStringId
  }

  emitDraw = () => this._store.dispatch(CanvasActions.drawCanvas())

  getMultiSelectedByType<T extends CanvasPanel>(type: T['type']): T[] {
    return this._multiSelected.filter(entity => entity.type === type) as T[]
  }

  startMultiSelectDragging(event: MouseEvent) {
    if (this._multiSelected.length === 0) return
    if (!event.shiftKey) return
    this.isMultiSelectDragging = true
    this.multiSelectStart = eventToXyLocation(event)
  }

  onMultiDragging(event: MouseEvent) {
    assertNotNull(this.multiSelectStart)
    const eventLocation = eventToXyLocation(event)
    const scale = this._domPointService.scale
    const offset = {
      x: eventLocation.x - this.multiSelectStart.x,
      y: eventLocation.y - this.multiSelectStart.y,
    }
    offset.x = offset.x / scale
    offset.y = offset.y / scale
    this.multiSelected.forEach(entity => {
      const location = entity.location

      const newLocation = {
        x: location.x + offset.x,
        y: location.y + offset.y,
      }

      // this.draggingEntityLocationsMap.set(entity.id, newLocation)
      this._canvasEntitiesService.dispatch.updateCanvasEntity({ id: entity.id, changes: { location: newLocation } })
    })
  }

  stopMultiSelectDragging(event: MouseEvent) {
    this.isMultiSelectDragging = false
    if (this.multiSelectStart) {
      const eventLocation = eventToXyLocation(event)
      const scale = this._domPointService.scale
      const offset = {
        x: eventLocation.x - this.multiSelectStart.x,
        y: eventLocation.y - this.multiSelectStart.y,
      }
      offset.x = offset.x / scale
      offset.y = offset.y / scale
      const multiSelectedUpdated = this.multiSelected.map(entity => {
        const location = entity.location
        const newLocation = {
          x: location.x + offset.x,
          y: location.y + offset.y,
        }

        // const newEntityInstance = entity.updateWithNewInstance(entity)
        const updatedEntity = EntityFactory.updateForStore(entity, { location: newLocation })
        // const updatedEntity = entity.updateForStore({ location: newLocation })
        const newEntityInstance = EntityFactory.update(entity, { location: newLocation })
        this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
        return newEntityInstance
      })
      this.setMultiSelected(multiSelectedUpdated)
    }
    this.multiSelectStart = undefined
    // this.offsetsFromMultiSelectCenter = []
    // this.draggingEntityLocationsMap.clear()
    return
  }

  setSelected(selected: CanvasEntity) {
    if (this._selected?.id === selected.id) {
      this._selected = undefined
      console.log('set selected', undefined)
      return
    }
    this._selected = selected
    this._selectedType = selected.type
    console.log('set selected', selected)
    this.emitDraw()
    // this.
    // this.emit(CanvasEvent.Draw)
  }

  setSelectedStringId(id: CanvasString['id']) {
    this._selectedStringId = id
    this._selectedType = SELECTED_TYPE.String
    console.log('set selected string id', id)
  }

  setMultiSelected(multiSelected: CanvasEntity[]) {
    this._multiSelected = multiSelected
    console.log('set multiSelected', multiSelected)
  }

  addToMultiSelected(selected: CanvasEntity) {
    /*    if (this._multiSelected.find(entity => entity.id === selected.id)) {
     this.removeFromMultiSelected(selected)
     return
     }*/

    if (this._selected) {
      this._multiSelected.push(this._selected)
      // this._multiSelected = [this._selected, selected]
      this._selected = undefined
      // return
    }

    this._multiSelected.push(selected)
    console.log('add to multiSelected', this._multiSelected)
  }

  removeFromMultiSelected(selected: CanvasEntity) {
    const index = this._multiSelected.indexOf(selected)
    if (index > -1) {
      this._multiSelected.splice(index, 1)
    }
    console.log('remove from multiSelected', selected)
  }

  clearSingleSelected() {
    if (this._selected) {
      this._selected = undefined
      console.log('clear selected')
      this.emitDraw()
      return
    }
  }

  clearSelectedState() {
    if (this._selected || this._multiSelected.length || this._selectedStringId) {
      this._selected = undefined
      this._multiSelected = []
      this._selectedStringId = undefined
      console.log('clear selected')
      this.emitDraw()
      return
    }
  }
}