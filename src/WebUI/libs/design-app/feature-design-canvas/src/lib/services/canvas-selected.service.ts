import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { CanvasEntity, CanvasString, EntityFactory, isPanel, UndefinedStringId } from '../types'
import { assertNotNull, mapToObject } from '@shared/utils'
import { DomPointService } from './dom-point.service'
import { CanvasEntitiesStore } from './canvas-entities'
import { eventToPointLocation } from '../functions'
import { CanvasAppStateStore } from './canvas-app-state'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { changeCanvasCursor } from '../utils'
import { InjectClientState } from './canvas-client-state'
import { CanvasElementService } from './canvas-element.service'
import { CanvasRenderService } from './canvas-render.service'

@Injectable({
  providedIn: 'root',
})
export class CanvasSelectedService {
  private _entitiesStore = inject(CanvasEntitiesStore)
  private _store = inject(Store)
  private _domPointService = inject(DomPointService)
  private _canvasEntitiesService = inject(CanvasEntitiesStore)
  private _entityStore = inject(CanvasAppStateStore)
  private _canvasEl = inject(CanvasElementService)
  private _render = inject(CanvasRenderService)
  private _state = InjectClientState()
  /*  private _selected: CanvasEntity | undefined
   private _selectedId: string | undefined
   private _selectedType: SelectedType | undefined
   private _selectedStringId: CanvasString['id'] | undefined
   private _multiSelected: CanvasEntity[] = []
   private _multiSelectedIds: string[] = []*/
  public isMultiSelectDragging = false

  /*  multiSelectStart: {
   x: number;
   y: number
   } | undefined

   get selected() {
   return this._selected
   }

   get selectedId() {
   return this._selectedId
   }

   get multiSelected() {
   return this._multiSelected
   }

   get multiSelectedIds() {
   return this._multiSelectedIds
   }

   get selectedType() {
   return this._selectedType
   }

   get selectedStringId() {
   return this._selectedStringId
   }*/

  // emitDraw = () => this._store.dispatch(CanvasActions.drawCanvas())

  /*  getMultiSelectedByType<T extends CanvasPanel>(type: T['type']): T[] {
   return this._multiSelected.filter(entity => entity.type === type) as T[]
   }*/

  /*  multiSelectDraggingMouseDown(event: MouseEvent) {
   // if (this._multiSelected.length === 0) return
   const selectedIds = this._state.selected.multipleSelectedIds
   if (selectedIds.length <= 0) return
   if (!event.shiftKey || !event.ctrlKey) return
   // if (!event.shiftKey) return
   // this.isMultiSelectDragging = true
   // this.multiSelectStart = eventToPointLocation(event)
   const multiSelectStart = this._domPointService.getTransformedPointFromEvent(event)
   this._state.updateState({
   toMove: {
   multipleToMove: {
   ids:        selectedIds,
   startPoint: multiSelectStart,
   },
   // multiToMoveStart: multiSelectStart,
   },
   })

   // this._entityStore.dispatch.setDraggingEntityIds()
   }*/

  multiSelectDraggingMouseMove(event: MouseEvent) {
    if (!event.shiftKey || !event.ctrlKey) {
      this.stopMultiSelectDragging(event)
      // this.drawPanels()
      return
    }
    changeCanvasCursor(this._canvasEl.canvas, CURSOR_TYPE.GRABBING)
    // this.canvas.style.cursor = CURSOR_TYPE.GRABBING
    this.onMultiDragging(event)

    // drawCanvas
    // drawCanvas()
    return
  }

  onMultiDragging(event: MouseEvent) {
    const multiToMove = this._state.toMove.multipleToMove
    assertNotNull(multiToMove)
    const multiToMoveStart = multiToMove.startPoint
    // const multiToMoveStart = this._state.toMove.multiToMove?.startPoint
    // if (!multiToMoveStart) return

    // assertNotNull(this.multiSelectStart)
    const eventLocation = eventToPointLocation(event)
    const scale = this._domPointService.scale
    const offset = {
      x: eventLocation.x - multiToMoveStart.x,
      y: eventLocation.y - multiToMoveStart.y,
    }
    offset.x = offset.x / scale
    offset.y = offset.y / scale

    // const multiSelectedIds = this._state.selected.ids
    const multiSelectedIds = this._state.selected.multipleSelectedIds
    const multiSelectedEntities = this._state.entity.getEntitiesByIds(multiSelectedIds)
    /*    const multiSelectedEntities = multiSelectedIds.map(id => this._state.entity.getEntity(id))
     .filter(entity => entity !== undefined) as CanvasEntity[]*/
    // const multiSelectedEntities = multiSelectedIds.map(id => this._entitiesStore.select.entityById(id))

    multiSelectedEntities.forEach(entity => {
      const location = entity.location

      const newLocation = {
        x: location.x + offset.x,
        y: location.y + offset.y,
      }

      // this.draggingEntityLocationsMap.set(entity.id, newLocation)
      // this._canvasEntitiesService.dispatch.updateCanvasEntity({ id: entity.id, changes: { location: newLocation } })
      this._state.entity.updateEntity(entity.id, { location: newLocation })
    })
    this._render.drawCanvas()
    /* this._state.updateState({
     toMove: {
     multiToMoveStart: eventLocation,
     },
     })*/
  }

  stopMultiSelectDragging(event: MouseEvent) {
    this.isMultiSelectDragging = false
    const multiToMove = this._state.toMove.multipleToMove
    assertNotNull(multiToMove)
    const multiToMoveStart = multiToMove.startPoint
    // const multiToMoveStart = this._state.toMove.multiToMoveStart
    if (!multiToMoveStart) return
    const eventLocation = eventToPointLocation(event)
    const scale = this._domPointService.scale
    const offset = {
      x: eventLocation.x - multiToMoveStart.x,
      y: eventLocation.y - multiToMoveStart.y,
    }
    offset.x = offset.x / scale
    offset.y = offset.y / scale
    const multiSelectedIds = this._state.selected.multipleSelectedIds
    // const multiSelectedEntities = this._state.selected.entities
    /* const multiSelected = Object.keys(multiSelectedEntities)
     .map(id => this._entitiesStore.select.entityById(id))*/
    const multiSelected = multiSelectedIds
      .map(id => this._state.entity.getEntity(id))
      .filter(entity => entity !== undefined) as CanvasEntity[]

    /*    const multiSelected = multiSelectedIds
     .map(id => this._entitiesStore.select.entityById(id))*/
    // const multiSelectedEntities = this._multiSelectedIds.map(id => this._entitiesStore.select.entityById(id))
    const multiSelectedUpdated = multiSelected.map(entity => {
      const location = entity.location
      const newLocation = {
        x: location.x + offset.x,
        y: location.y + offset.y,
      }

      // const newEntityInstance = entity.updateWithNewInstance(entity)
      const updatedEntity = EntityFactory.updateForStore(entity, { location: newLocation })
      // const updatedEntity = entity.updateForStore({ location: newLocation })
      const newEntityInstance = EntityFactory.update(entity, { location: newLocation })
      // this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
      this._state.entity.updateEntity(updatedEntity.id, updatedEntity.changes)
      // return updatedEntity
      return newEntityInstance
    })

    const storeUpdates = multiSelectedUpdated.map(entity => {
      return EntityFactory.updateForStore(entity, { location: entity.location })
    })
    this._state.entity.updateManyEntities(storeUpdates)

    // const multiSelectedIdsUpdated = multiSelectedUpdated.map(entity => entity.id)
    // const multiSelectedUpdateObj = mapToObject(multiSelectedUpdated)
    this._state.updateState({
      toMove: {
        multipleToMove: undefined,
      },
    })
    this._render.drawCanvas()
    // this._state.entity.updateManyEntities(multiSelectedUpdated)
    // this._state.updateState({
    //   selected: {
    //     ids: multiSelectedIds,
    //     entities: multiSelectedUpdated,
    //   }
    // })

    // const multiSelectedIds = multiSelectedUpdated.map(entity => entity.id)
    // this.setMultiSelected(multiSelectedIds)
    /*    this._state.updateState({
     selected: {
     ids: multiSelectedIds,
     entities: multiSelectedUpdated,
     }
     }*/
    /*    if (this.multiSelectStart) {
     const eventLocation = eventToPointLocation(event)
     const scale = this._domPointService.scale
     const offset = {
     x: eventLocation.x - this.multiSelectStart.x,
     y: eventLocation.y - this.multiSelectStart.y,
     }
     offset.x = offset.x / scale
     offset.y = offset.y / scale
     const multiSelectedEntities = this._multiSelectedIds.map(id => this._entitiesStore.select.entityById(id))
     const multiSelectedUpdated = multiSelectedEntities.map(entity => {
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
     const multiSelectedIds = multiSelectedUpdated.map(entity => entity.id)
     this.setMultiSelected(multiSelectedIds)
     }
     this.multiSelectStart = undefined*/
    // this.offsetsFromMultiSelectCenter = []
    // this.draggingEntityLocationsMap.clear()
    return
  }

  handleEntityUnderMouse(event: MouseEvent, entityUnderMouse: CanvasEntity) {
    if (event.shiftKey) {
      this.addToMultiSelected(entityUnderMouse.id)
      return
    }
    this.setSelected(entityUnderMouse.id)
    return
  }

  handleEntityDoubleClick(event: MouseEvent, entityUnderMouse: CanvasEntity, strings: CanvasString[]) {
    if (!isPanel(entityUnderMouse)) {
      this.setSelectedStringId(undefined)
      this._state.updateState({
        selected: {
          selectedStringId: undefined,
        },
      })
      console.log('implement double click for non panel')
      return
    }
    if (entityUnderMouse.stringId === UndefinedStringId) {
      console.log('implement double click for undefined string')
      return
    }

    const belongsToString = strings.find(string => string.id === entityUnderMouse.stringId)
    assertNotNull(belongsToString, 'string not found')
    this.setSelectedStringId(belongsToString.id)
    this._state.updateState({
      selected: {
        selectedStringId: belongsToString.id,
      },
    })
    return
  }

  setSelected(selectedId: string) {
    /*    if (this._selected?.id === selected.id) {
     this._selected = undefined
     console.log('set selected', undefined)
     return
     }*/
    /*    if (this._selectedId === selectedId) {
     this._selected = undefined
     this._selectedId = undefined
     this._selectedType = undefined
     console.log('set selected', undefined)
     this._entityStore.dispatch.setSelectedId(undefined)
     return
     }*/
    // this._selected = selected
    // this._selectedType = selected.type
    // this._selectedId = selectedId
    // this._entityStore.dispatch.setSelectedId(selectedId)
    this._state.updateState({
      selected: {
        singleSelectedId: selectedId,
        /*        singleSelected: {
         id:   selectedId,
         type: ENTITY_TYPE.Panel,
         },*/
      },
    })
    console.log('set selected', selectedId)
    // this.emitDraw()
    // this.
    // this.emit(CanvasEvent.Draw)
  }

  setSelectedStringId(id: CanvasString['id'] | undefined) {
    // this._selectedStringId = id
    // this._selectedType = SELECTED_TYPE.String
    // this._entityStore.dispatch.setSelectedStringId(id)
    this._state.updateState({
      selected: {
        selectedStringId: id,
      },
    })
    console.log('set selected string id', id)
  }

  setMultiSelected(multiSelectedIds: string[]) {
    // this._multiSelected = multiSelected
    const multiSelected = mapToObject(multiSelectedIds.map(id => this._state.entity.getEntity(id))
      .filter(isNotNull))
    // const multiSelected = mapToObject(multiSelectedIds.map(id => this._entitiesStore.select.entityById(id)))
    // this._multiSelectedIds = multiSelectedIds
    this._entityStore.dispatch.setSelectedIds(multiSelectedIds)
    this._state.updateState({
      selected: {
        multipleSelectedIds: multiSelectedIds,
      },
    })
    console.log('set multiSelected', multiSelectedIds)
  }

  addToMultiSelected(selectedId: string) {
    /*    if (this._multiSelected.find(entity => entity.id === selected.id)) {
     this.removeFromMultiSelected(selected)
     return

     }*/
    const singleSelectedId = this._state.selected.singleSelectedId
    // const selected = this._state.selected.singleSelected
    if (singleSelectedId && singleSelectedId === selectedId) {
      this._entityStore.dispatch.setSelectedId(undefined)
      this._state.updateState({
        selected: {
          singleSelectedId: undefined,
        },
      })
      return
    }

    const multipleSelectedIds = this._state.selected.multipleSelectedIds
    if (multipleSelectedIds.includes(selectedId)) {
      this._state.updateState({
        selected: {
          multipleSelectedIds: multipleSelectedIds.filter(id => id !== selectedId),
          // ids:      multipleSelectedIds.filter(id => id !== selectedId),
          // entities: omit(this._state.selected.entities, selectedId),
        },
      })

      // this._entityStore.dispatch.removeFromSelectedIds([selectedId])
      // this._multiSelectedIds = this._multiSelectedIds.filter(id => id !== selectedId)
      // console.log('remove from multiSelected', this._multiSelectedIds)
      return
    }

    if (!selectedId) return

    // if (selectedId) {
    // this._entityStore.dispatch.addToSelectedIds([selectedId])
    const selectedEntity = this._state.entity.getEntity(selectedId)
    assertNotNull(selectedEntity, 'selected entity not found')
    /*    const selectedTypeOf = {
     id:  selectedId,
     type: selectedEntity?.type,
     }*/
    // const selectedTypeOf = this._state.entity.getTypeOf(selectedId)
    this._state.updateState({
      selected: {
        multipleSelectedIds: [...multipleSelectedIds, selectedId],
        // ids:      [...multipleSelectedIds, selectedId],
        // entities: { ...this._state.selected.entities, [selectedId]: selectedEntity },
      },
    })
    // this._multiSelectedIds.push(selectedId)
    // console.log('add to multiSelected', this._multiSelectedIds)
    // }

    /*    if (this._selectedId) {
     this._multiSelectedIds.push(this._selectedId)
     // this._multiSelected.push(this._selected)
     this._entityStore.dispatch.setSelectedId(undefined)
     this._entityStore.dispatch.addToSelectedIds([this._selectedId])
     const selected = this._state.selected.singleSelected

     this._state.updateState({
     selected: {
     singleSelected: undefined,
     ids:           [selected.id],
     entities:      { [selected.id]: selected },
     }
     }
     // this._multiSelected = [this._selected, selected]
     this._selectedId = undefined
     // return
     }*/

    // this._entityStore.dispatch.addToSelectedIds([selectedId])
    // this._multiSelectedIds.push(selectedId)
    // console.log('add to multiSelected', this._multiSelectedIds)
  }

  removeFromMultiSelected(selected: CanvasEntity) {
    /*    const index = this._multiSelected.indexOf(selected)
     if (index > -1) {
     this._multiSelected.splice(index, 1)
     }
     console.log('remove from multiSelected', selected)
     this._entityStore.dispatch.removeFromSelectedIds([selected.id])*/
    // this._state.selected.
    this._state.updateState({
      selected: {
        // ids:      this._state.selected.ids.filter(id => id !== selected.id),
        multipleSelectedIds: this._state.selected.multipleSelectedIds.filter(id => id !== selected.id),
        // entities: omit(this._state.selected.entities, selected.id),
      },
    })
  }

  checkSelectedState(event: MouseEvent, clickedOnEntityId: string) {
    /*    if (this.selected?.id !== clickedOnEntityId && !event.shiftKey) {
     this.clearSingleSelected()

     }*/
    const singleSelectedId = this._state.selected.singleSelectedId
    if (!singleSelectedId || singleSelectedId !== clickedOnEntityId && !event.shiftKey) {
      // this.clearSelectedState()
      this.clearSingleSelected()
      // this._entityStore.dispatch.clearState()
    }
  }

  clearSingleSelected() {
    if (this._state.selected.singleSelectedId) {
      this._state.updateState({
        selected: {
          singleSelectedId: undefined,
        },
      })
    }
    /*    if (this._selectedId) {
     this._selectedId = undefined
     this._entityStore.dispatch.setSelectedId(undefined)
     console.log('clear selected')
     // this.emitDraw()
     return
     }*/
  }

  clearSelectedState() {
    this._state.updateState({
      selected: {
        singleSelectedId:    undefined,
        multipleSelectedIds: [],
      },
    })
    /*    if (this._selectedId || this._multiSelectedIds.length || this._selectedStringId) {
     // this._selected = undefined
     this._selectedId = undefined
     // this._multiSelected = []
     this._multiSelectedIds = []
     this._selectedStringId = undefined
     this._entityStore.dispatch.clearState()
     console.log('clear selected')

     // this.emitDraw()
     return
     }*/
  }
}

export const isNotNull = <T>(value: T | null | undefined): value is T => value !== null && value !== undefined