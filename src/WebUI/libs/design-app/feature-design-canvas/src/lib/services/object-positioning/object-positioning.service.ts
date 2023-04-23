import { inject, Injectable } from '@angular/core'
import { CanvasClientStateService, CanvasElementService, CanvasRenderService, DomPointService } from '..'
import { TypeOfEntity } from '@design-app/feature-selected'
import { CURSOR_TYPE } from '@shared/data-access/models'
import { CanvasEntity, changeCanvasCursor, EntityFactory, eventToPointLocation, getEntityBounds, getTopLeftPointFromTransformedPoint, isPointInsideBounds, SizeByType, TransformedPoint, updateObjectByIdForStore } from '@design-app/feature-design-canvas'
import { assertNotNull } from '@shared/utils'

@Injectable({
  providedIn: 'root',
})
export class ObjectPositioningService {
  private _state = inject(CanvasClientStateService)
  private _domPoint = inject(DomPointService)
  private _render = inject(CanvasRenderService)
  private _canvasElement = inject(CanvasElementService)

  get canvas() {
    return this._canvasElement.canvas
  }

  singleToMoveMouseMove(event: MouseEvent, entityOnMouseDown: TypeOfEntity) {
    if (!this._state.mouse.mouseDown) {
      // if (!isHoldingClick(event)) {
      // console.log('singleToMoveMouseMove - not holding click')
      this._state.updateState({
        toMove: {
          singleToMove: undefined,
        },
      })
      return
    }
    // console.log('singleToMoveMouseMove', event)
    // assertNotNull(this.singleToMove)
    changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
    // console.log('singleToMoveMouseMove', this.canvas)
    // this.canvas.style.cursor = CURSOR_TYPE.MOVE
    const eventPoint = this._domPoint.getTransformedPointFromEvent(event)
    const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(eventPoint, entityOnMouseDown.id)
    if (isSpotTaken) {
      // TODO - change cursor to not allowed
      // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
      // changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
      // return
    }
    const location = getTopLeftPointFromTransformedPoint(eventPoint, SizeByType[entityOnMouseDown.type])
    const ent = this._state.entities.canvasEntities.getEntityById(entityOnMouseDown.id)
    assertNotNull(ent)
    const angle = ent.angle
    // const update = updateObjectByIdForStore(entityOnMouseDown.id, { location })
    // this._entitiesStore.dispatch.updateCanvasEntity(update)
    // this.performanceStart.push({ time: performance.now(), location })
    /*    this.singleToMoveId = entityOnMouseDown.id
     this.singleToMoveLocation = location
     this.singleToMove = {
     id:   entityOnMouseDown.id,
     type: entityOnMouseDown.type,
     location,
     }*/
    this._state.updateState({
      toMove: {
        singleToMove: {
          id:   entityOnMouseDown.id,
          type: entityOnMouseDown.type,
          location,
          angle,
        },
        // singleToMoveEntityId: entityOnMouseDown.id,
        /*        singleToMoveEntity: {
         id:   entityOnMouseDown.id,
         type: entityOnMouseDown.type,
         location,
         angle,
         // angle: entityOnMouseDown.angle,
         },*/
      },
    })
    // this._render.drawCanvas()
    /*    this._state.updater.toMove({
     singleToMoveEntity: {
     id:    entityOnMouseDown.id,
     type:  entityOnMouseDown.type,
     location,
     angle: entityOnMouseDown.angle,
     },
     // ids: [entityOnMouseDown.id],
     // entities: [entityOnMouseDown],
     })*/
    /*    this._clientState.updateState({
     singleToMoveEntity: {
     id:   entityOnMouseDown.id,
     type: entityOnMouseDown.type,
     location,
     },
     })*/
    /*  updateClientStateCallback({
     singleToMoveEntity: {
     id:   entityOnMouseDown.id,
     type: entityOnMouseDown.type,
     location,
     },
     })*/
    this._render.drawCanvas()
    // drawCanvasCallback()
  }

  singleToMoveMouseUp(event: MouseEvent, singleToMove: TypeOfEntity) {
    // this.isDraggingEntity = false
    // assertNotNull(this.singleToMoveId)
    // const entityToMove = this._entitiesStore.select.entityById(entityOnMouseDown.id)
    const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, singleToMove.type)
    // const updatedEntity = EntityFactory.updateForStore(entityToMove, { location })
    const update = updateObjectByIdForStore(singleToMove.id, { location })
    // this._entitiesStore.dispatch.updateCanvasEntity(update)
    this._state.entities.canvasEntities.updateEntity(singleToMove.id, { location })
    // this.singleToMoveId = undefined
    // this.singleToMoveLocation = undefined
    // this.singleToMove = undefined
    console.log('entityOnMouseDown', update)
    changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
    // updateClientStateCallback({ singleToMoveEntity: undefined })
    /*    this._clientState.updater.toMove({
     singleToMoveEntity: undefined,
     })*/
    this._state.updateState({
      toMove: {
        singleToMove: undefined,
        // singleToMoveEntity: undefined,
      },
    })
    this._render.drawCanvas()
    // */
    /*    if (this.entityOnMouseDown) {
     const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
     const updatedEntity = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
     this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
     this.entityOnMouseDown = undefined
     }*/
    return
  }

  multiSelectDraggingMouseDown(event: MouseEvent, multipleSelectedIds: string[]) {
    // if (this._multiSelected.length === 0) return
    /*    const selectedIds = this._state.selected.multipleSelectedIds
     if (selectedIds.length <= 0) return*/
    if (!event.shiftKey || !event.ctrlKey) return
    // if (!event.shiftKey) return
    // this.isMultiSelectDragging = true
    // this.multiSelectStart = eventToPointLocation(event)
    const multiSelectStart = this._domPoint.getTransformedPointFromEvent(event)
    this._state.updateState({
      toMove: {
        multipleToMove: {
          ids:        multipleSelectedIds,
          startPoint: multiSelectStart,
          offset:     { x: 0, y: 0 },
          entities:   this._state.entities.canvasEntities.getEntitiesByIds(multipleSelectedIds),
        },
        // multiToMoveStart: multiSelectStart,
      },
    })

    // this._entityStore.dispatch.setDraggingEntityIds()
  }

  setMultiSelectDraggingMouseMove(event: MouseEvent, multipleSelectedIds: string[]) {
    if (!event.shiftKey || !event.ctrlKey) {
      this.stopMultiSelectDragging(event)
      // this.drawPanels()
      return
    }
    const multiToMove = this._state.toMove.multipleToMove
    if (multiToMove) return
    // changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
    // this.canvas.style.cursor = CURSOR_TYPE.GRABBING

    // assertNotNull(multiToMove)
    const multiToMoveStart = this._domPoint.getTransformedPointFromEvent(event)
    // const multiSelectedIds = this._state.selected.multipleSelectedIds
    if (multipleSelectedIds.length <= 0) return
    const entities = this._state.entities.canvasEntities.getEntitiesByIds(multipleSelectedIds)
    // const multiToMoveStart = this._state.toMove.multiToMove?.startPoint
    // if (!multiToMoveStart) return
    // const multiSelectStart = this._domPoint.getTransformedPointFromEvent(event)
    // assertNotNull(this.multiSelectStart)
    /*    const eventLocation = eventToPointLocation(event)
     const scale = this._domPoint.scale
     const offset = {
     x: eventLocation.x - multiToMoveStart.x,
     y: eventLocation.y - multiToMoveStart.y,
     }*/
    /*   const entities = multiToMove.entities.map((e) => {
     return {
     ...e,
     location: {
     x: e.location.x + offset.x / scale,
     y: e.location.y + offset.y / scale,
     },
     }
     })*/
    this._state.updateState({
      toMove: {
        multipleToMove: {
          ids:        multipleSelectedIds,
          entities,
          offset:     { x: 0, y: 0 },
          startPoint: multiToMoveStart,
        },
      },
    })
    // this._render.drawCanvas()
    // this.drawPanels()
  }

  multiSelectDraggingMouseMove(event: MouseEvent) {
    if (!event.shiftKey || !event.ctrlKey) {
      this.stopMultiSelectDragging(event)
      // this.drawPanels()
      return
    }
    changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
    // this.canvas.style.cursor = CURSOR_TYPE.GRABBING
    const multiToMove = this._state.toMove.multipleToMove
    assertNotNull(multiToMove)
    const multiToMoveStart = multiToMove.startPoint
    // const multiToMoveStart = this._state.toMove.multiToMove?.startPoint
    // if (!multiToMoveStart) return

    // assertNotNull(this.multiSelectStart)
    // const eventLocation = eventToPointLocation(event)
    const eventLocation = this._domPoint.getTransformedPointFromEvent(event)
    const scale = this._domPoint.scale
    const offset = {
      x: eventLocation.x - multiToMoveStart.x,
      y: eventLocation.y - multiToMoveStart.y,
    }
    // offset.x = offset.x / scale
    // offset.y = offset.y / scale

    // const multiSelectedIds = this._state.selected.ids
    // const multiSelectedIds = this._state.selected.multipleSelectedIds
    const multiToMoveIds = multiToMove.ids
    const multiToMoveEntities = multiToMove.entities
    const updates = multiToMoveEntities.map((entity) => {
      const location = entity.location
      const newLocation = {
        x: location.x + offset.x,
        y: location.y + offset.y,
      }
      return {
        ...entity,
        location: newLocation,
      }
      // return updateObjectByIdForStore(entity.id, { location: newLocation })
      /*   this._state.updateState({
       toMove: {
       multipleToMove: {
       ids:        multiToMoveIds,
       startPoint: multiToMoveStart,

       }
       }
       })*/
      // this._state.entity.updateEntity(entity.id, { location: newLocation })
    })
    this._state.updateState({
      toMove: {
        multipleToMove: {
          ids:        multiToMoveIds,
          startPoint: multiToMoveStart,
          offset,
          entities:   updates,
        },
      },
    })
    // const multiSelectedEntities = this._state.entity.getEntitiesByIds(multiSelectedIds)
    /*    const multiSelectedEntities = multiSelectedIds.map(id => this._state.entity.getEntity(id))
     .filter(entity => entity !== undefined) as CanvasEntity[]*/
    // const multiSelectedEntities = multiSelectedIds.map(id => this._entitiesStore.select.entityById(id))

    /*    const updates = multiSelectedIds.map((id) => {
     const entity = this._state.entity.getEntity(id)
     assertNotNull(entity)
     const location = entity.location
     const newLocation = {
     x: location.x + offset.x,
     y: location.y + offset.y,
     }
     return updateObjectByIdForStore(id, { location: newLocation })
     })
     this._state.entity.updateManyEntities(updates)*/
    /*    multiSelectedEntities.forEach(entity => {
     const location = entity.location

     const newLocation = {
     x: location.x + offset.x,
     y: location.y + offset.y,
     }

     // this.draggingEntityLocationsMap.set(entity.id, newLocation)
     // this._canvasEntitiesService.dispatch.updateCanvasEntity({ id: entity.id, changes: { location: newLocation } })
     this._state.entity.updateEntity(entity.id, { location: newLocation })
     })*/
    this._render.drawCanvas()

    // drawCanvas
    // drawCanvas()
    return
  }

  stopMultiSelectDragging(event: MouseEvent) {
    // this.isMultiSelectDragging = false
    const multiToMove = this._state.toMove.multipleToMove
    assertNotNull(multiToMove)
    const multiToMoveStart = multiToMove.startPoint
    // const multiToMoveStart = this._state.toMove.multiToMoveStart
    if (!multiToMoveStart) return
    const eventLocation = eventToPointLocation(event)
    const scale = this._domPoint.scale
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
      .map(id => this._state.entities.canvasEntities.getEntityById(id))
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
      this._state.entities.canvasEntities.updateEntity(updatedEntity.id, updatedEntity.changes)
      // return updatedEntity
      return newEntityInstance
    })

    const storeUpdates = multiSelectedUpdated.map(entity => {
      return EntityFactory.updateForStore(entity, { location: entity.location })
    })
    this._state.entities.canvasEntities.updateManyEntities(storeUpdates)

    this._state.updateState({
      toMove: {
        multipleToMove: undefined,
      },
    })

    this._canvasElement.changeCursor('')
    this._render.drawCanvas()
    return
  }

  areAnyEntitiesNearbyExcludingGrabbed(
    point: TransformedPoint,
    grabbedId: string,
  ) {
    return !!this._state.entities.canvasEntities.getEntities()
      .find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
    // return !!this.entities.find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
  }
}