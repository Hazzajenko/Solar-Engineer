import { inject, Injectable } from '@angular/core'
import { CanvasEntity, SizeByType, TransformedPoint, updateObjectByIdForStore } from '../types'
import { DomPointService } from './dom-point.service'
import { CanvasElementService } from './canvas-element.service'
import { CURSOR_TYPE, Point } from '@shared/data-access/models'
import { assertNotNull } from '@shared/utils'
import { AngleRadians, changeCanvasCursor, DIAGONAL_DIRECTION, DiagonalDirection, filterEntitiesInsideBounds, getAngleInRadiansBetweenTwoPoints, getBoundsFromTwoPoints, getDiagonalDirectionFromTwoPoints, getEntityBounds, getStartingSpotForCreationBox, getTopLeftPointFromTransformedPoint, isEntityInsideTwoPoints, isPointInsideBounds, rotatePointOffPivot, rotatingKeysDown, SpotInBox } from '../utils'
import { getEntitySizeOffset } from '../functions/object-sizing'
import { ENTITY_TYPE } from '@design-app/shared'
import { CanvasSelectedService } from './canvas-selected.service'
import { CanvasClientStateService, MultipleToRotateEntity, SingleToRotate } from './canvas-client-state'
import { CanvasRenderService } from './canvas-render.service'
import { TypeOfEntity } from '@design-app/feature-selected'

@Injectable({
  providedIn: 'root',
})
export class CanvasObjectPositioningService {
  // private _entitiesStore = inject(CanvasEntitiesStore)
  // private _appStore = inject(CanvasAppStateStore)
  private _domPointService = inject(DomPointService)
  private _canvasElementsService = inject(CanvasElementService)
  private _selected = inject(CanvasSelectedService)
  private _state = inject(CanvasClientStateService)
  private _render = inject(CanvasRenderService)

  // rotateStats: HTMLDivElement | undefined = undefined

  /*  entityToRotateId: string | undefined = undefined
   entityToRotateAngle: AngleRadians | undefined = undefined

   multipleToRotateIds: string[] = []
   multipleToRotateAngle: number | undefined = undefined
   multipleToRotateAdjustedAngle: Map<string, AngleRadians> = new Map()
   multipleToRotateAdjustedLocation: Map<string, Point> = new Map()*/

  pivotPoint: Point | undefined = undefined
  currentCenterPoint!: Point
  currentMousePoint!: Point

  /*  private _startPoint: Point | undefined = undefined
   private _startRotateAngleToMouse: AngleRadians | undefined = undefined
   private _startRotateRadiansToMouse: number | undefined = undefined*/

  // startPointToCurrentPointAngleInRadians: AngleRadians | undefined = undefined
  // startPointToPivotPointAngleInRadians: AngleRadians | undefined = undefined

  // singleRotateMode = false

  /*  singleToMoveId: string | undefined = undefined
   singleToMoveLocation: Point | undefined = undefined
   singleToMove: EntityLocation | undefined = undefined*/

  // singleToMoveAnimationId: number | undefined = undefined
  // transformedMousePoint: TransformedPoint | undefined = undefined

  // multipleToMoveIds: string[] = []

  performanceStart: {
    time: number
    location: Point
  }[] = []
  performanceEnd: {
    time: number
    location: Point
  }[] = []

  get isInSingleRotateMode() {
    const { singleToRotate, singleRotateMode } = this._state.toRotate
    return !!singleToRotate && singleRotateMode
    // return !!this.entityToRotateId && this.singleRotateMode
  }

  private get entities() {
    return this._state.entity.getEntities()
    // return this._entitiesStore.select.entities
  }

  get ctx() {
    return this._canvasElementsService.ctx
  }

  get canvas() {
    return this._canvasElementsService.canvas
  }

  get areAnyEntitiesInRotate() {
    const { singleToRotate, ids } = this._state.toRotate
    return !!singleToRotate || !!ids.length
    // return !!this.entityToRotateId || !!this.multipleToRotateIds.length
  }

  /*  singleToMoveMouseDown(singleToMove: TypeOfEntity) {
   this.singleToMoveId = singleToMove.id
   this.singleToMove = singleToMove
   }*/

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
    const eventPoint = this._domPointService.getTransformedPointFromEvent(event)
    const isSpotTaken = this.areAnyEntitiesNearbyExcludingGrabbed(eventPoint, entityOnMouseDown.id)
    if (isSpotTaken) {
      // TODO - change cursor to not allowed
      // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
      // changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
      // return
    }
    const location = getTopLeftPointFromTransformedPoint(eventPoint, SizeByType[entityOnMouseDown.type])
    const ent = this._state.entity.getEntity(entityOnMouseDown.id)
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

  setPerformanceEnd(location: Point) {
    const start = this.performanceStart.find((p) => p.location.x === location.x && p.location.y === location.y)
    if (!start) return
    console.log('performance', performance.now() - start.time)
  }

  singleToMoveMouseUp(event: MouseEvent, singleToMove: TypeOfEntity) {
    // this.isDraggingEntity = false
    // assertNotNull(this.singleToMoveId)
    // const entityToMove = this._entitiesStore.select.entityById(entityOnMouseDown.id)
    const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, singleToMove.type)
    // const updatedEntity = EntityFactory.updateForStore(entityToMove, { location })
    const update = updateObjectByIdForStore(singleToMove.id, { location })
    // this._entitiesStore.dispatch.updateCanvasEntity(update)
    this._state.entity.updateEntity(singleToMove.id, { location })
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
     const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
     const updatedEntity = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
     this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
     this.entityOnMouseDown = undefined
     }*/
    return
  }

  multipleToMoveMouseDown(multipleToMoveIds: string[]) {
    /*    this._state.updateState({
     toMove: {
     multiToMove: {
     ids: multipleToMoveIds,

     },
     },
     })*/
    // this.multipleToMoveIds = multipleToMoveIds
  }

  multipleToMoveMouseUp(event: MouseEvent) {
    /*    const entitiesToMove = this._entitiesStore.select.entitiesByIds(this.multipleToMoveIds)
     const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.RECTANGLE)
     const updatedEntities = entitiesToMove.map(entity => EntityFactory.updateForStore(entity, { location }))
     this._entitiesStore.dispatch.updateCanvasEntities(updatedEntities)*/
    // this.multipleToMoveIds = []
    this._state.updateState({
      toMove: {
        multiToMove: undefined,
      },
    })
  }

  handleSetEntitiesToRotate(event: MouseEvent) {
    // const selectedId = this._selected.selectedId
    const selectedId = this._state.selected.singleSelectedId
    if (selectedId) {
      const transformedPoint = this._domPointService.getTransformedPointFromEvent(event)
      this.setEntityToRotate(selectedId, transformedPoint)
      return
    }
    // const multiSelectIds = this._selected.multiSelectedIds
    const multiSelectIds = this._state.selected.multipleSelectedIds
    if (multiSelectIds.length > 1) {
      const transformedPoint = this._domPointService.getTransformedPointFromEvent(event)
      this.setMultipleToRotate(multiSelectIds, transformedPoint)
      return
    }
  }

  setEntityToRotate(entityId: string, startPoint: TransformedPoint) {
    // this.entityToRotateId = entityId
    // this._startPoint = startPoint
    const location = this._state.entity.getEntity(entityId)?.location
    assertNotNull(location)
    // const location = this._entitiesStore.select.entityById(entityId).location
    const startAngle = getAngleInRadiansBetweenTwoPoints(startPoint, location)
    this._state.updateState({
      toRotate: {
        singleToRotate: {
          id: entityId,
          startPoint,
          startAngle,
        },
      },
    })
    /*    const location = this._state.entity.getEntity(entityId)?.location
     assertNotNull(location)
     // const location = this._entitiesStore.select.entityById(entityId).location
     this._startRotateAngleToMouse = getAngleInRadiansBetweenTwoPoints(startPoint, location)*/
    // this.singleRotateMode = true
    /*    this._startRotateAngleToMouse = roundToTwoDecimals(
     Math.atan2(startPoint.y - entity.location.y, startPoint.x - entity.location.x) * (180 / Math.PI),
     )*/
  }

  setMultipleToRotate(multipleToRotateIds: string[], startPoint: TransformedPoint) {
    /*    this.multipleToRotateIds = multipleToRotateIds
     this._startPoint = startPoint
     this.multipleToRotateAdjustedAngle = new Map()
     this.multipleToRotateAdjustedLocation = new Map()*/
    const pivotPoint = this.calculatePivotPointPosition(multipleToRotateIds)
    const startToPivotAngle = getAngleInRadiansBetweenTwoPoints(startPoint, pivotPoint)
    this._state.updateState({
      toRotate: {
        multipleToRotate: {
          ids:      multipleToRotateIds,
          entities: [],
          pivotPoint,
          startToPivotAngle,
        },
      },
    })

    // this.pivotPoint = this.calculatePivotPointPosition(multipleToRotateIds)
    // this.startPointToPivotPointAngleInRadians = getAngleInRadiansBetweenTwoPoints(startPoint, this.pivotPoint)
    // console.log('pivotPoint', this.pivotPoint)
    // console.log('startPointToPivotPointAngleInRadians', this.startPointToPivotPointAngleInRadians)
    // this.startPointToCurrentPointAngleInRadians = getAngleInRadiansBetweenTwoPoints(startPoint, this.currentCenterPoint)
  }

  rotateEntityViaMouse(event: MouseEvent, singleToRotate: SingleToRotate) {
    // const singleToRotate
    // if (!this.entityToRotateId) return
    // if (!this._startPoint) return
    // if (!this._startRotateAngleToMouse) return
    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    const entityLocation = this._state.entity.getEntity(singleToRotate.id)?.location
    assertNotNull(entityLocation)
    // const entityLocation = this._entitiesStore.select.entityById(this.entityToRotateId).location
    const previousAngle = singleToRotate.startAngle
    const radians = getAngleInRadiansBetweenTwoPoints(currentPoint, entityLocation)
    const angle = radians - previousAngle as AngleRadians
    // const radians = Math.atan2(currentPoint.y - entityLocation.y, currentPoint.x - entityLocation.x)
    // const degrees = radians * 180 / Math.PI
    // this.entityToRotateAngle = radians - this._startRotateAngleToMouse as AngleRadians
    // this.entityToRotateAngle = degrees - this._startRotateAngleToMouse

    // this._startPoint = currentPoint
    this._state.updateState({
      toRotate: {
        singleToRotate: {
          ...singleToRotate,
          startPoint:    currentPoint,
          adjustedAngle: angle,
        },
      },
    })
    this._render.drawCanvas()
  }

  rotateMultipleEntitiesViaMouse(event: MouseEvent, multipleToRotateIds: string[]) {
    // const multipleToRotateIds = this.multipleToRotateIds
    if (!multipleToRotateIds.length) return
    if (!rotatingKeysDown(event)) {
      this.clearEntityToRotate()
      return
    }
    const multipleToRotate = this._state.toRotate.multipleToRotate
    assertNotNull(multipleToRotate)
    const pivotPoint = multipleToRotate.pivotPoint
    assertNotNull(pivotPoint)
    // if (!pivotPoint) return
    // const pivotPoint = this.pivotPoint
    // console.log('pivotPoint', pivotPoint)

    const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
    this.currentMousePoint = currentPoint
    const angleInRadians = getAngleInRadiansBetweenTwoPoints(currentPoint, pivotPoint)
    const canvasEntities = this._state.entity.getEntitiesByIds(multipleToRotateIds)
    /*    const canvasEntities = multipleToRotateIds.map(id => this._state.entity.getEntity(id))
     .filter(isNotNull)*/
    /*    const canvasEntities = this.multipleToRotateIds.map(id => this._state.entity.getEntity(id))
     .filter(isNotNull)*/
    // const canvasEntities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))
    const startToPivotAngle = multipleToRotate.startToPivotAngle
    assertNotNull(startToPivotAngle)
    // assertNotNull(this.startPointToPivotPointAngleInRadians)
    const adjustedAngle = angleInRadians - startToPivotAngle as AngleRadians
    // const adjustedAngleRadians = angleInRadians - this.startPointToPivotPointAngleInRadians as AngleRadians
    const entities = canvasEntities.map(entity => {
      const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngle)
      return {
        id:               entity.id,
        adjustedLocation: getPos,
      } as MultipleToRotateEntity
    })
    // const entities = mapToDictionary(entityMap)
    this._state.updateState({
      toRotate: {
        multipleToRotate: {
          ...multipleToRotate,
          adjustedAngle,
          entities,
        },
      },
    })
    /*    canvasEntities.forEach(entity => {
     const getPos = rotatePointOffPivot(entity.location, pivotPoint, adjustedAngleRadians)
     this.multipleToRotateAdjustedAngle.set(entity.id, adjustedAngleRadians)
     this.multipleToRotateAdjustedLocation.set(entity.id, getPos)
     })*/
    this._render.drawCanvas()
  }

  calculatePivotPointPosition(multipleToRotateIds: string[]) {
    const entities = this._state.entity.getEntitiesByIds(multipleToRotateIds)
    /*    const entities = this.multipleToRotateIds.map(id => this._state.entity.getEntity(id))
     .filter(isNotNull)*/
    assertNotNull(entities)
    // const entities = this.multipleToRotateIds.map(id => this._entitiesStore.select.entityById(id))
    const totalX = entities.reduce((acc, entity) => acc + entity.location.x, 0)
    const totalY = entities.reduce((acc, entity) => acc + entity.location.y, 0)
    const pivotX = totalX / entities.length
    const pivotY = totalY / entities.length
    return { x: pivotX, y: pivotY }
  }

  clearEntityToRotate() {
    // const toRotate = this._state.toRotate
    const multipleToRotate = this._state.toRotate.multipleToRotate
    assertNotNull(multipleToRotate)
    /*    if (toRotate.singleToRotate) {
     this._state.updateState({
     toRotate: {
     singleToRotate: undefined,
     },
     })
     }*/
    if (multipleToRotate.ids.length) {
      const storeUpdates = multipleToRotate.ids.map(id => {
        const entity = this._state.entity.getEntity(id)
        assertNotNull(entity)
        // const entity = this._entitiesStore.select.entityById(id)
        /*     const multipleToRotate = this._state.toRotate.multipleToRotate
         assertNotNull(multipleToRotate)*/
        const angle = multipleToRotate.adjustedAngle
        const location = multipleToRotate.entities.find(e => e.id === id)?.adjustedLocation
        // const location = this._state.toRotate.multipleToRotate.entities[id]?.adjustedLocation
        // const angle = this.multipleToRotateAdjustedAngle.get(entity.id)
        // const location = this.multipleToRotateAdjustedLocation.get(entity.id)
        assertNotNull(angle)
        assertNotNull(location)

        return updateObjectByIdForStore(id, { location, angle })
      })
      this._state.entity.updateManyEntities(storeUpdates)
      this._state.updateState({
        toRotate: {
          ids:              [],
          multipleToRotate: undefined,
        },
      })
      // this._state.entity.
    }
    const singleToRotate = this._state.toRotate.singleToRotate
    if (singleToRotate) {
      // const storeUpdate = updateObjectByIdForStore(singleToRotate.id, { angle: singleToRotate.adjustedAngle })
      this._state.entity.updateEntity(singleToRotate.id, { angle: singleToRotate.adjustedAngle })
      // this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
      this._state.updateState({
        toRotate: {
          singleToRotate:   undefined,
          singleRotateMode: false,
        },
      })
    }

    /*    if (this.entityToRotateId && this.entityToRotateAngle) {
     const storeUpdate = updateObjectByIdForStore(this.entityToRotateId, { angle: this.entityToRotateAngle })
     this._state.entity.updateEntity(this.entityToRotateId, { angle: this.entityToRotateAngle })
     // this._entitiesStore.dispatch.updateCanvasEntity(storeUpdate)
     }*/

    /*    if (this.multipleToRotateIds.length > 1) {
     const storeUpdates = this.multipleToRotateIds.map(id => {
     const entity = this._state.entity.getEntity(id)
     assertNotNull(entity)
     // const entity = this._entitiesStore.select.entityById(id)
     const angle = this.multipleToRotateAdjustedAngle.get(entity.id)
     const location = this.multipleToRotateAdjustedLocation.get(entity.id)
     assertNotNull(angle)
     assertNotNull(location)

     return updateObjectByIdForStore(id, { location, angle })
     })
     this._state.entity.updateManyEntities(storeUpdates)
     // this._entitiesStore.dispatch.updateManyCanvasEntities(storeUpdates)
     }*/
    // this._state.updateState({
    //   toRotate: {
    //     ids: [],
    //   }
    // })

    /*    this.entityToRotateId = undefined
     this._startPoint = undefined
     this._startRotateAngleToMouse = undefined
     this.entityToRotateAngle = undefined
     this.multipleToRotateIds = []
     this.singleRotateMode = false
     this.multipleToRotateAdjustedAngle = new Map()
     this.multipleToRotateAdjustedLocation = new Map()
     this.pivotPoint = undefined
     this.startPointToPivotPointAngleInRadians = undefined*/
    this._render.drawCanvas()
  }

  getAllAvailableEntitySpotsBetweenTwoPoints(
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    const distanceX = point1.x - point2.x
    const distanceY = point1.y - point2.y
    const entitySize = SizeByType[ENTITY_TYPE.Panel]
    const widthWithMidSpacing = entitySize.width + 2
    const heightWithMidSpacing = entitySize.height + 2
    const entitiesInX = Math.floor(distanceX / widthWithMidSpacing)
    const entitiesInY = Math.floor(distanceY / heightWithMidSpacing)
    const diagonalDirection = getDiagonalDirectionFromTwoPoints(point1, point2)
    if (!diagonalDirection) return

    const startingPoint = getStartingSpotForCreationBox(diagonalDirection, entitySize)
    const twoPointBounds = getBoundsFromTwoPoints(point1, point2)

    const existingEntities = filterEntitiesInsideBounds(twoPointBounds, this.entities)
    const widthIsPositive = entitiesInX > 0
    const adjustedWidth = widthIsPositive
      ? -widthWithMidSpacing
      : widthWithMidSpacing

    const heightIsPositive = entitiesInY > 0
    const adjustedHeight = heightIsPositive
      ? -heightWithMidSpacing
      : heightWithMidSpacing
    const spots: SpotInBox[] = []
    for (let i = 0; i < Math.abs(entitiesInX); i++) {

      for (let a = 0; a < Math.abs(entitiesInY); a++) {
        const spot: SpotInBox = {
          vacant: true,
          x:      point1.x + startingPoint.x + i * adjustedWidth,
          y:      point1.y + startingPoint.y + a * adjustedHeight,
        }
        existingEntities.forEach((entity) => {
          const firstSpot = {
            x: spot.x - entity.width / 2,
            y: spot.y - entity.height / 2,
          }
          const secondSpot = {
            x: spot.x + entity.width + entity.width / 2,
            y: spot.y + entity.width + entity.height / 2,
          }
          if (isEntityInsideTwoPoints(entity, firstSpot, secondSpot)) {
            spot.vacant = false
          }
        })
        spots.push(spot)
      }
    }

    return spots
  }

  isEntityInsideByDirection(
    entity: CanvasEntity,
    direction: DiagonalDirection,
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    // const start

    switch (direction) {
      case DIAGONAL_DIRECTION.BottomLeftToTopRight:
        return entity.location.x > point1.x && entity.location.x < point2.x && entity.location.y < point1.y && entity.location.y > point2.y
      case DIAGONAL_DIRECTION.TopLeftToBottomRight:
        return entity.location.x > point1.x && entity.location.x < point2.x && entity.location.y > point1.y && entity.location.y < point2.y
      case DIAGONAL_DIRECTION.TopRightToBottomLeft:
        return entity.location.x < point1.x && entity.location.x > point2.x && entity.location.y > point1.y && entity.location.y < point2.y
      case DIAGONAL_DIRECTION.BottomRightToTopLeft:
        return entity.location.x < point1.x && entity.location.x > point2.x && entity.location.y < point1.y && entity.location.y > point2.y
    }

  }

  isEntityInsideTwoPoints(
    entity: CanvasEntity,
    point1: Point,
    point2: Point,
  ) {
    const bounds = getEntityBounds(entity)
    const box = getBoundsFromTwoPoints(point1, point2)

    return !(
      box.right < bounds.left ||
      box.left > bounds.right ||
      box.bottom < bounds.top ||
      box.top > bounds.bottom
    )
  }

  getInsideCheckPointsByDirection(
    direction: DiagonalDirection,
  ) {
    switch (direction) {
      case DIAGONAL_DIRECTION.BottomLeftToTopRight:
        return {}
      case DIAGONAL_DIRECTION.TopLeftToBottomRight:
        return {}
      case DIAGONAL_DIRECTION.TopRightToBottomLeft:
        return {}
      case DIAGONAL_DIRECTION.BottomRightToTopLeft:
        return {}
    }
  }

  getAllElementsBetweenTwoPoints(
    point1: TransformedPoint,
    point2: TransformedPoint,
  ) {
    // const test = this._entitiesStore.select.entities.filter((entity) => filterAllEntityBetweenTwoPoints(point1, point2, entity, DIAGONAL_DIRECTION.BottomLeftToTopRight))
    return this._state.entity.getEntities()
      .filter((objectRect) => {
        // return this._entitiesStore.select.entities.filter((objectRect) => {
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
  }

  areAnyEntitiesNearbyExcludingGrabbed(
    point: TransformedPoint,
    grabbedId: string,
  ) {
    return !!this.entities.find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
    // return !!this.entities.find((entity) => entity.id !== grabbedId && isPointInsideBounds(point, getEntityBounds(entity)))
  }
}