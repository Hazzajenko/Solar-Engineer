import { Directive, OnInit } from '@angular/core'
import { CURSOR_TYPE, KEYS } from '@shared/data-access/models'
import { createPanel, isPanel } from '../types'
import { ENTITY_TYPE } from '@design-app/shared'
import { assertNotNull, OnDestroyDirective } from '@shared/utils'
import { changeCanvasCursor, dragBoxKeysDown, draggingScreenKeysDown, isContextMenu, isDraggingEntity, isMenuOpen, isMultiSelectDragging, isReadyToMultiDrag, rotatingKeysDown } from '../utils'
import { DesignCanvasDirectiveExtension } from './design-canvas-directive.extension'
import { CANVAS_MODE } from '../services/canvas-client-state/types/mode'

@Directive({
  selector:   '[appDesignCanvas]',
  providers:  [OnDestroyDirective],
  standalone: true,
})
export class DesignCanvasDirective
  extends DesignCanvasDirectiveExtension
  implements OnInit {

  public ngOnInit() {
    this.setupCanvas()
    this._ngZone.runOutsideAngular(() => {
      this.setupMouseEventListeners()
    })
    this.mousePos = document.getElementById('mouse-pos') as HTMLDivElement
    this.transformedMousePos = document.getElementById('transformed-mouse-pos') as HTMLDivElement
    this.scaleElement = document.getElementById('scale-element') as HTMLDivElement
    this.stringStats = document.getElementById('string-stats') as HTMLDivElement
    this.panelStats = document.getElementById('panel-stats') as HTMLDivElement
    this.menu = document.getElementById('menu') as HTMLDivElement
    // this.appState$.subscribe()
    // this.entities$.subscribe()
    // this.strings$.subscribe()
  }

  /**
   * ! Event Handlers
   */

  /**
   * Mouse Down handler
   * @param event
   * @private
   */

  onMouseDownHandler(event: MouseEvent) {
    if (isContextMenu(event)) {
      return
    }
    /*    if (event.button === POINTER_BUTTON.SECONDARY) {
     return
     }*/
    this.mouseDownTimeOut = setTimeout(() => {
      this.mouseDownTimeOut = undefined
    }, 100)
    if (draggingScreenKeysDown(event)) {
      this._view.handleDragScreenMouseDown(event)
      return
    }
    /*    const isDraggingScreen = (event.ctrlKey || event.button === POINTER_BUTTON.WHEEL) && !event.shiftKey
     if (isDraggingScreen) {
     this.isDraggingScreen = true
     this.screenDragStartPoint = this._domPointService.getTransformedPointFromEvent(event)
     return
     }*/
    if (dragBoxKeysDown(event)) {
      console.log('drag box keys down')
      this._drag.handleDragBoxMouseDown(event)
      // this._drag.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
      // this.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
      return
    }
    /*    if (event.altKey) {
     this.isSelectionBoxDragging = true
     this.selectionBoxStartPoint = this._domPointService.getTransformedPointFromEvent(event)
     }*/
    const { selected } = this._state.getState()
    if (isMultiSelectDragging(event, selected.ids)) {

      // if (multiSelectDraggingKeysDown(event, this._selected.multiSelectedIds)) {
      // if (multiSelectDraggingKeysDown(event, this._selected.multiSelectedIds)) {
      this._selected.multiSelectDraggingMouseDown(event)
      return
    }
    /*    const isMultiSelectDragging = event.shiftKey && event.ctrlKey && this._selected.multiSelected.length > 0
     if (isMultiSelectDragging) {
     this._selected.startMultiSelectDragging(event)
     return
     }*/
    const entityUnderMouse = this.getEntityUnderMouseV2(event)
    // const entityUnderMouse = this.getEntityUnderMouse(event)
    if (entityUnderMouse) {
      /*      this.entityOnMouseDown = {
       id:   entityUnderMouse.id,
       type: entityUnderMouse.type,
       }*/
      this._state.updateState({
        hover: {
          onMouseDownEntityId: entityUnderMouse.id,
        },
        /*        toMove: {
         singleToMoveEntity: entityUnderMouse,
         }*/
      })
      // this.entityOnMouseDown = entityUnderMouse
      // this.entityOnMouseDownId = entityUnderMouse.id
      // this._appStateStore.dispatch.set
      this._selected.checkSelectedState(event, entityUnderMouse.id)
    }

  }

  /**
   * Mouse Up handler
   * @param event
   * @private
   */

  onMouseUpHandler(event: MouseEvent) {
    if (isContextMenu(event)) return
    if (this.mouseDownTimeOut) {
      clearTimeout(this.mouseDownTimeOut)
      this.mouseDownTimeOut = undefined
      // this.entityOnMouseDownId = undefined
      // this.entityOnMouseDown = undefined
      this._state.updateState({
        hover: {
          onMouseDownEntityId: undefined,
        },
      })
      return
    }
    this.mouseUpTimeOut = setTimeout(() => {
      this.mouseUpTimeOut = undefined
    }, 100)
    if (this._view.screenDragStartPoint) {
      this._view.handleDragScreenMouseUp(event)
    }
    // if (event.button === POINTER_BUTTON.SECONDARY) return
    // console.log('mouse up', event)
    // TODO - fix this
    /*   if (this.isDraggingScreen) {
     this.isDraggingScreen = false
     return
     }*/
    /*
     if (this._drag.selectionBoxStartPoint) {
     this._drag.selectionBoxStartPoint = undefined

     return
     }*/

    const dragStart = this._state.dragBox.start
    if (dragStart) {
      this._drag.dragBoxMouseUp(event)
      return
    }
    /*    if (this._drag.selectionBoxStartPoint) {
     this._drag.selectionBoxMouseUp(event)
     this.drawCanvas()
     // this._drag.selectionBoxStartPoint = undefined
     return
     }

     if (this._drag.creationBoxStartPoint) {
     this._drag.creationBoxMouseUp(event)
     this.drawCanvas()
     return
     }*/

    /*    if (this.isSelectionBoxDragging) {
     this.isSelectionBoxDragging = false
     if (
     this.selectionBoxStartPoint) {
     if (this._mode.mode === CANVAS_MODE.CREATE) {

     const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(this.selectionBoxStartPoint, this._domPointService.getTransformedPointFromEvent(event))
     if (!spots || !spots.length) return
     const takenSpots = spots.filter(spot => !spot.vacant)
     if (takenSpots.length) {
     console.log('taken spots', takenSpots)
     return
     }
     const newPanels = spots.map(spot =>
     createPanel({ x: spot.x, y: spot.y }),
     )
     this._entitiesStore.dispatch.addManyCanvasEntities(newPanels)
     return
     }
     if (this._mode.mode === CANVAS_MODE.SELECT) {
     const panelsInArea = this._objectPositioning.getAllElementsBetweenTwoPoints(this.selectionBoxStartPoint, this._domPointService.getTransformedPointFromEvent(event))
     if (panelsInArea) {
     const entitiesInAreaIds = panelsInArea.map(panel => panel.id)
     this._selected.setMultiSelected(entitiesInAreaIds)
     }
     }
     }
     this.selectionBoxStartPoint = undefined
     this.drawPanels()
     return
     }*/
    /*    const onMouseDownEntity = this._state.hover.onMouseDownEntity
     if (onMouseDownEntity) {
     this._objectPositioning.singleToMoveMouseUp(event, onMouseDownEntity)
     this.entityOnMouseDown = undefined
     }*/

    const singleToMove = this._state.toMove.singleToMove
    if (singleToMove) {
      // console.log('singleToMove', singleToMove)
      this._objectPos.singleToMoveMouseUp(event, singleToMove)
      return
    }
    /*    if (this.entityOnMouseDown) {
     this._objectPositioning.singleToMoveMouseUp(event, this.entityOnMouseDown)
     this.entityOnMouseDown = undefined
     }*/
    /*    if (this._objectPositioning.singleToMoveId) {
     this._objectPositioning.singleToMoveMouseUp(event)
     }*/

    /*    if (this.isDraggingEntity) {
     this.isDraggingEntity = false
     console.log('entityOnMouseDown', this.entityOnMouseDown)
     if (this.entityOnMouseDown) {
     const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
     const updatedEntity = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
     this._entitiesStore.dispatch.updateCanvasEntity(updatedEntity)
     this.entityOnMouseDown = undefined
     }
     return
     }
     if (this._selected.isMultiSelectDragging) {
     this._selected.stopMultiSelectDragging(event)
     return
     }
     this.isDraggingEntity = false
     this.isDraggingScreen = false
     this.entityOnMouseDown = undefined*/
  }

  /**
   * Mouse Click handler
   * @param event
   * @private
   */

  mouseClickHandler(event: PointerEvent) {
    if (isMenuOpen(this.menu)) {
      this.menu.style.display = 'none'
      return
    }
    /*    if (this.menu.style.display === 'initial') {
     this.menu.style.display = 'none'
     return
     }*/
    if (this.mouseUpTimeOut) {
      clearTimeout(this.mouseUpTimeOut)
      this.mouseUpTimeOut = undefined
      return
    }
    const singleRotateMode = this._state.toRotate.singleRotateMode
    if (singleRotateMode) {
      // if (this._objectPos.singleRotateMode) {
      // this._objectPositioning.singleRotateMode = false
      this._objectPos.clearEntityToRotate()
      return
    }

    // console.log('click', event)
    const entityUnderMouse = this.getEntityUnderMouse(event)
    // const isPanel = this.getMouseOverPanel(event)
    if (entityUnderMouse) {
      this._selected.handleEntityUnderMouse(event, entityUnderMouse)
      return/*      if (event.shiftKey) {
       this._selected.addToMultiSelected(entityUnderMouse.id)
       return
       }
       this._selected.setSelected(entityUnderMouse.id)
       return*/
    }
    this._selected.clearSelectedState()
    // this._selected.clearSingleSelected()
    if (this.anyEntitiesNearAreaOfClick(event)) {
      return
    }
    const location = this._domPoint.getTransformedPointToMiddleOfObjectFromEvent(event, ENTITY_TYPE.Panel)
    const isStringSelected = !!this._selected.selectedStringId
    const entity = isStringSelected
      ? createPanel(location, this._selected.selectedStringId)
      : createPanel(location)
    // TODO - fix this
    // this._entitiesStore.dispatch.addCanvasEntity(entity)
    this._state.entity.addEntity(entity)
    /*  let entity: CanvasEntity

     if (!isStringSelected) {
     const entity = createPanel(location)
     this._entitiesStore.dispatch.addCanvasEntity(entity)
     }*/

    this._render.drawCanvas()
    // this.drawCanvas()
    // this.drawPanels()
  }

  /**
   * Double Click handler
   * @param event
   * @private
   */

  doubleClickHandler(event: PointerEvent) {
    console.log('double click', event)
    const entityUnderMouse = this.getEntityUnderMouse(event)
    // const isPanel = this.getMouseOverPanel(event)
    if (entityUnderMouse) {
      // TODO - fix this
      // this._selected.handleEntityDoubleClick(event, entityUnderMouse, this.strings)
      /*      if (!isPanel(entityUnderMouse)) return
       if (entityUnderMouse.stringId === UndefinedStringId) return
       const belongsToString = this.strings.find(string => string.id === entityUnderMouse.stringId)
       assertNotNull(belongsToString, 'string not found')
       this._selected.setSelectedStringId(belongsToString.id)*/
    }
    /*    const mouseOverPanel = this.getMouseOverPanel(event)
     if (mouseOverPanel) {
     if (!isPanel(mouseOverPanel)) return
     if (mouseOverPanel.stringId === UndefinedStringId) return
     const belongsToString = this.strings.find(string => string.id === mouseOverPanel.stringId)
     assertNotNull(belongsToString, 'string not found')
     this._selected.setSelectedStringId(belongsToString.id)
     }*/
  }

  /**
   * Mouse Move handler
   * @param event
   * @private
   */

  onMouseMoveHandler(event: MouseEvent) {
    this.currentTransformedCursor = this._domPoint.getTransformedPointFromEvent(event)
    this.mousePos.innerText = `Original X: ${event.offsetX}, Y: ${event.offsetY}`
    this.transformedMousePos.innerText = `Transformed X: ${this.currentTransformedCursor.x}, Y: ${this.currentTransformedCursor.y}`
    /*   if(this._objectPositioning.entityToRotateId) {
     this._objectPositioning.rotateEntityViaMouse(event)
     this.drawPanels()
     return
     }*/

    const singleToRotate = this._state.toRotate.singleToRotate
    const singleRotateMode = this._state.toRotate.singleRotateMode
    // const multipleToRotate = this._state.toRotate.multipleToRotate
    // const singleToMove = this._state.toMove.singleToMove
    // const multipleToMove = this._state.toMove.multipleToMove
    if (singleToRotate && singleRotateMode) {
      this._objectPos.rotateEntityViaMouse(event, singleToRotate)
      // this._render.drawCanvas()
      return
    }
    if (singleToRotate && rotatingKeysDown(event)) {
      this._objectPos.rotateEntityViaMouse(event, singleToRotate)
      // this._render.drawCanvas()
      return
    }
    /*
     if (this._objectPos.isInSingleRotateMode) {
     // if (this._objectPositioning.singleRotateMode && this._objectPositioning.entityToRotateId) {
     this._objectPos.rotateEntityViaMouse(event)
     // this.drawPanels()
     // this.drawCanvas()
     return
     }

     // const rotateKeys = event.altKey && event.ctrlKey
     if (this._objectPos.entityToRotateId && rotatingKeysDown(event)) {
     this._objectPos.rotateEntityViaMouse(event)
     // this.drawPanels()
     // this.drawCanvas()
     return

     }*/

    const multipleToRotate = this._state.toRotate.multipleToRotate
    if (multipleToRotate.ids.length > 1 && rotatingKeysDown(event)) {
      this._objectPos.rotateMultipleEntitiesViaMouse(event, multipleToRotate.ids)
      // this.drawPanels()
      // this.drawCanvas()
      return
    }
    /*    if (this._objectPos.multipleToRotateIds.length > 1 && rotatingKeysDown(event)) {
     // if (this._objectPositioning.multipleToRotateIds.length > 1 && rotateKeys) {
     this._objectPos.rotateMultipleEntitiesViaMouse(event)
     // this.drawPanels()
     // this.drawCanvas()
     return
     }*/

    if (!this._objectPos.areAnyEntitiesInRotate && rotatingKeysDown(event)) {
      this._objectPos.handleSetEntitiesToRotate(event)
      // this._objectPositioning.handleSetEntitiesToRotate(event, this._selected.selectedId, this._selected.multiSelectedIds)
      // if (!this._objectPositioning.areAnyEntitiesInRotate && rotateKeys) {
      /*      const selectedId = this._selected.selectedId
       if (selectedId) {
       const transformedPoint = this._domPointService.getTransformedPointFromEvent(event)
       this._objectPositioning.setEntityToRotate(selectedId, transformedPoint)
       return
       }
       const multiSelectIds = this._selected.multiSelectedIds
       if (multiSelectIds.length > 1) {
       const transformedPoint = this._domPointService.getTransformedPointFromEvent(event)
       this._objectPositioning.setMultipleToRotate(multiSelectIds, transformedPoint)
       return
       }*/
    }

    /*if (event.altKey && event.ctrlKey) {
     if (!this._objectPositioning.areAnyEntitiesInRotate) {

     const multiSelected = this._selected.multiSelected
     if (multiSelected.length > 1) {
     const multiSelectedIds = multiSelected.map(entity => entity.id)
     const transformedPoint = this._domPointService.getTransformedPointFromEvent(event)
     this._objectPositioning.setMultipleToRotate(multiSelectedIds, transformedPoint)
     return
     }
     const selected = this._selected.selected
     if (selected) {
     const transformedPoint = this._domPointService.getTransformedPointFromEvent(event)
     this._objectPositioning.setEntityToRotate(selected.id, transformedPoint)
     return
     }
     } else {
     if (this._objectPositioning.multipleToRotateIds.length > 1) {
     this._objectPositioning.rotateMultipleEntitiesViaMouse(event)
     this.drawPanels()
     return
     }
     if (this._objectPositioning.entityToRotateId) {
     this._objectPositioning.rotateEntityViaMouse(event)
     this.drawPanels()
     }
     }

     }*/
    if (this._objectPos.areAnyEntitiesInRotate && !rotatingKeysDown(event)) {
      // if (this._objectPositioning.areAnyEntitiesInRotate && (!event.altKey || !event.ctrlKey)) {
      this._objectPos.clearEntityToRotate()
      // this.drawCanvas()
      return
    }
    if (this._view.screenDragStartPoint) {
      this._view.handleDragScreenMouseMove(event)
      // this.drawCanvas()
      return
    }
    /*    if (this.isDraggingScreen) {
     if (event.ctrlKey || event.buttons === 4) {
     this.canvas.style.cursor = CURSOR_TYPE.MOVE
     const transformX = this.currentTransformedCursor.x - this.screenDragStartPoint.x
     const transformY = this.currentTransformedCursor.y - this.screenDragStartPoint.y
     this.ctx.translate(transformX, transformY)
     this.drawPanels()
     }
     return
     }*/
    if (this._state.dragBox.start) {
      this._drag.dragBoxMouseMove(event)
      return
      /*    if (this._drag.dragBoxStartPoint) {
       this._drag.dragBoxMouseMove(event)*/
      /*      if (dragBoxKeysDown(event)) {
       // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
       changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
       this._drag.dragBoxMouseMove(event)
       // this.animateDragBox(event)
       return
       }
       this._drag.dragBoxStartPoint = undefined
       changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
       // this.canvas.style.cursor = CURSOR_TYPE.AUTO
       // this.canvas.style.cursor = CURSOR_TYPE.AUTO
       return*/
    }
    /*    if (this._drag.selectionBoxStartPoint) {
     if (dragBoxKeysDown(event)) {
     // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
     changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
     // this.animateSelectionBox(event)
     this._drag.
     return
     }
     this._drag.selectionBoxStartPoint = undefined
     this.canvas.style.cursor = CURSOR_TYPE.AUTO
     return
     }
     if (this._drag.creationBoxStartPoint) {
     if (dragBoxKeysDown(event)) {
     // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
     changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
     this.animateCreationBox(event)
     return
     }
     this._drag.creationBoxStartPoint = undefined
     this.canvas.style.cursor = CURSOR_TYPE.AUTO
     return
     }*/
    /*    if (this.isSelectionBoxDragging) {
     if (!event.altKey) {
     this.isSelectionBoxDragging = false
     this.selectionBoxStartPoint = undefined
     this.drawPanels()
     return
     }
     if (this._mode.mode === CANVAS_MODE.SELECT) {
     this.animateSelectionBox(event)
     return
     }
     if (this._mode.mode === CANVAS_MODE.CREATE) {
     this.animateCreationBox(event)
     return
     }
     return
     }*/
    if (isReadyToMultiDrag(event, this._selected.multiSelectedIds)) {
      changeCanvasCursor(this.canvas, CURSOR_TYPE.GRAB)
      // this._selected.startMultiSelectDragging(event)
      // this.drawPanels()
      return
    }
    /*   const isReadyToMultiDrag = this._selected.multiSelected.length > 0 && event.shiftKey && event.ctrlKey && !this._selected.isMultiSelectDragging
     if (isReadyToMultiDrag) {
     this.canvas.style.cursor = CURSOR_TYPE.GRAB
     return
     }*/
    if (isMultiSelectDragging(event, this._selected.multiSelectedIds)) {
      // const callback = () => this.drawCanvas()
      return this._selected.multiSelectDraggingMouseMove(event)
    }
    /*    if (this._selected.isMultiSelectDragging) {
     if (!event.shiftKey || !event.ctrlKey) {
     this._selected.stopMultiSelectDragging(event)
     this.drawPanels()
     return
     }
     this.canvas.style.cursor = CURSOR_TYPE.GRABBING
     this._selected.onMultiDragging(event)
     this.drawPanels()
     return
     }*/

    const onMouseDownEntityId = this._state.hover.onMouseDownEntityId

    if (isDraggingEntity(event, onMouseDownEntityId)) {
      assertNotNull(onMouseDownEntityId)
      const entity = this._state.entity.getEntity(onMouseDownEntityId)
      assertNotNull(entity)
      this._state.updateState({
        hover: {
          onMouseDownEntityId: undefined,
        },

        toMove: {
          singleToMove: {
            id:       onMouseDownEntityId,
            type:     entity.type,
            location: entity.location,
            angle:    entity.angle,
          },
        },
      })
      /*      const type = this._state.entity.getEntity(onMouseDownEntityId)?.type
       assertNotNull(type)
       this._objectPos.singleToMoveMouseMove(event, {
       id: onMouseDownEntityId,
       type,
       })*/
      // return
    }

    /*    const onMouseDownEntity = this._state.hover.onMouseDownEntity
     if (isDraggingEntity(event, onMouseDownEntity?.id)) {
     assertNotNull(onMouseDownEntity)

     this._state.updateState(
     {
     toMove: {
     singleToMoveEntity: onMouseDownEntity,
     },
     hover:  {
     onMouseDownEntity: undefined,
     },
     })
     }*/

    const singleToMove = this._state.toMove.singleToMove
    if (isDraggingEntity(event, singleToMove?.id)) {
      assertNotNull(singleToMove)
      // if (isDraggingEntity(event, this.entityOnMouseDown?.id)) {
      // assertNotNull(singleToMoveEntity)
      // assertNotNull(this.entityOnMouseDown)
      // changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
      const type = this._state.entity.getEntity(singleToMove.id)?.type
      assertNotNull(type)
      this._objectPos.singleToMoveMouseMove(event, {
        id: singleToMove.id,
        type,
      })
      // this._objectPositioning.singleToMoveMouseMove(event, this.entityOnMouseDown)
      return
      // TODO remove
      // this.drawCanvas()
      // this
    }

    /*
     const singleToMoveEntity = this._state.toMove.singleToMoveEntity
     if (isDraggingEntity(event, singleToMoveEntity?.id)) {
     // if (isDraggingEntity(event, this.entityOnMouseDown?.id)) {
     assertNotNull(singleToMoveEntity)
     // assertNotNull(this.entityOnMouseDown)
     // changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
     this._objectPos.singleToMoveMouseMove(event, singleToMoveEntity)
     // this._objectPositioning.singleToMoveMouseMove(event, this.entityOnMouseDown)
     return
     // TODO remove
     // this.drawCanvas()
     // this
     }
     */

    /*    const mouseDownEntity = this._state.hover.onMouseDownEntity
     if (isDraggingEntity(event, mouseDownEntity?.id)) {
     // if (isDraggingEntity(event, this.entityOnMouseDown?.id)) {
     assertNotNull(mouseDownEntity)
     // assertNotNull(this.entityOnMouseDown)
     // changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
     this._objectPositioning.singleToMoveMouseMove(event, mouseDownEntity)
     // this._objectPositioning.singleToMoveMouseMove(event, this.entityOnMouseDown)
     return
     // TODO remove
     // this.drawCanvas()
     // this
     }*/
    /*    if (isDraggingEntity(event, this.entityOnMouseDown)) {
     assertNotNull(this.entityOnMouseDown)
     // this.canvas.style.cursor = CURSOR_TYPE.GRABBING
     changeCanvasCursor(this.canvas, CURSOR_TYPE.GRABBING)
     // this.isDraggingEntity = true
     // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
     // const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
     const eventPoint = this._domPointService.getTransformedPointFromEvent(event)
     const isSpotTaken = this.anyObjectsNearLocationExcludingGrabbed(eventPoint, this.entityOnMouseDown.id)
     if (isSpotTaken) {
     // this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
     changeCanvasCursor(this.canvas, CURSOR_TYPE.CROSSHAIR)
     // return
     }
     // const entityOnMouseDownBounds = getEntityBounds(this.entityOnMouseDown)
     const location = getTopLeftPointFromTransformedPoint(eventPoint, SizeByType[this.entityOnMouseDown.type])
     this.updateToEndOfLocalArray(this.entityOnMouseDown.id, { location })
     // updateObjectByIdForStore()
     // this.entityOnMouseDown = EntityFactory.update(this.entityOnMouseDown, { location })
     // this.updateToBackOfArray(this.entityOnMouseDown, { location })
     }*/
    /*    if (this.entityOnMouseDown) {
     this.canvas.style.cursor = CURSOR_TYPE.GRABBING
     this.isDraggingEntity = true
     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
     // const location = this._domPointService.getTransformedPointToMiddleOfObjectFromEvent(event, this.entityOnMouseDown.type)
     const eventPoint = this._domPointService.getTransformedPointFromEvent(event)
     const isSpotTaken = this.anyObjectsNearLocationExcludingGrabbed(eventPoint, this.entityOnMouseDown)
     if (isSpotTaken) {
     this.canvas.style.cursor = CURSOR_TYPE.CROSSHAIR
     // return
     }
     // const entityOnMouseDownBounds = getEntityBounds(this.entityOnMouseDown)
     const location = getTopLeftPointFromTransformedPoint(eventPoint, SizeByType[this.entityOnMouseDown.type])

     this.entityOnMouseDown = EntityFactory.update(this.entityOnMouseDown, { location })
     this.updateToBackOfArray(this.entityOnMouseDown, { location })
     /!*    const entityUpdate = EntityFactory.updateForStore(this.entityOnMouseDown, { location })
     this._entitiesStore.dispatch.updateCanvasEntity(entityUpdate)*!/
     // this.
     return
     }*/

    const entityUnderMouse = this.getEntityUnderMouse(event)
    if (entityUnderMouse) {
      changeCanvasCursor(this.canvas, CURSOR_TYPE.POINTER)
      // if (this.appState.hoveringEntityId === entityUnderMouse.id) return
      const hoveringEntityId = this._state.hover.hoveringEntityId
      if (hoveringEntityId === entityUnderMouse.id) return
      // if (this._state.hover.hoveringEntity?.id === entityUnderMouse.id) return
      // this._appStateStore.dispatch.setHoveringEntityId(entityUnderMouse.id)
      this._state.updateState({
        hover: {
          hoveringEntityId: entityUnderMouse.id,
        },
      })
      // this.appState.hoveringEntityId = entityUnderMouse.id
      // this.drawCanvas()
      this._render.drawCanvas()
    } else {
      if (this._state.hover.hoveringEntityId) {
        // if (this.appState.hoveringEntityId) {
        // this.appState.hoveringEntityId = undefined
        // this._appStateStore.dispatch.setHoveringEntityId(undefined)
        this._state.updateState({
          hover: {
            hoveringEntityId: undefined,
          },
        })
        this._render.drawCanvas()
        // this.drawCanvas()
      }
      changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
    }
    /*    const isPanel = this.getMouseOverPanel(event)
     if (isPanel) {

     this.canvas.style.cursor = CURSOR_TYPE.POINTER
     if (this.hoveringEntityId === isPanel.id) return
     this.hoveringEntityId = isPanel.id
     this.drawPanels()
     return
     } else {
     if (this.hoveringEntityId) {
     this.hoveringEntityId = undefined
     this.drawPanels()
     }
     this.canvas.style.cursor = CURSOR_TYPE.AUTO
     }*/
  }

  /**
   * Wheel Scroll handler
   * @param event
   * @private
   */

  wheelScrollHandler(event: WheelEvent) {
    const currentScaleX = this.ctx.getTransform().a

    const zoom = event.deltaY < 0
      ? 1.1
      : 0.9

    const currentTransformedCursor = this._domPoint.getTransformedPointFromEvent(event)
    this.ctx.translate(currentTransformedCursor.x, currentTransformedCursor.y)
    this.ctx.scale(zoom, zoom)
    this.ctx.translate(-currentTransformedCursor.x, -currentTransformedCursor.y)
    this.scaleElement.innerText = `Scale: ${currentScaleX}`

    // this.drawPanels()
    this._render.drawCanvas()
    // this.drawCanvas()
    event.preventDefault()
  }

  /**
   * Context Menu handler
   * @param event
   * @private
   */

  contextMenuHandler(event: PointerEvent) {
    const entityUnderMouse = this.getEntityUnderMouse(event)
    // const mouseOverPanel = this.getMouseOverPanel(event)
    if (entityUnderMouse) {
      // if (!isPanel(mouseOverPanel)) return
      // const panel = mouseOverPanel
      this._renderer.setStyle(this.menu, 'display', 'initial')
      this._renderer.setStyle(this.menu, 'top', `${event.offsetY + entityUnderMouse.height / 2}px`)
      this._renderer.setStyle(this.menu, 'left', `${event.offsetX + entityUnderMouse.width / 2}px`)
      this._renderer.setAttribute(this.menu, 'data-id', entityUnderMouse.id)
      this._renderer.setAttribute(this.menu, 'data-type', entityUnderMouse.type)
      this._renderer.setAttribute(this.menu, 'data-angle', entityUnderMouse.angle.toString())
      if (!isPanel(entityUnderMouse)) return
      this._renderer.setAttribute(this.menu, 'data-stringId', entityUnderMouse.stringId)
    }
  }

  /**
   * Key Up handler
   * @private
   * @param event
   */
  keyUpHandler(event: KeyboardEvent) {
    switch (event.key) {
      case KEYS.ESCAPE:
        this._selected.clearSelectedState()
        break
      case KEYS.X: {
        // TODO: move to local store
        /*     if (this._selected.multiSelected.length > 0) {
         this._stringsService.createStringWithPanels(this._selected.getMultiSelectedByType(ENTITY_TYPE.Panel), this.strings)

         }*/
      }
        break
      case KEYS.R: {
        console.log('r key up')
        const singleToRotate = this._state.toRotate.singleToRotate

        if (singleToRotate) {
          /*          this._state.updateState({
           toRotate: {
           singleToRotate: undefined,
           },
           })
           this._render.drawCanvas()*/
          this._objectPos.clearEntityToRotate()
          return
        }
        const multipleToRotate = this._state.toRotate.multipleToRotate
        if (multipleToRotate.ids.length > 0) {
          /*          this._state.updateState({
           toRotate: {
           multipleToRotate: undefined,
           },
           })
           this._render.drawCanvas()*/
          this._objectPos.clearEntityToRotate()
          return
        }
        /*        if (this._objectPos.entityToRotateId) {
         this._objectPos.clearEntityToRotate()
         return
         }
         if (this._objectPos.multipleToRotateIds.length > 0 && !this._objectPos.entityToRotateId) {
         this._objectPos.clearEntityToRotate()
         return
         }*/
        // const entity
        const entityToRotate = this._state.toRotate.singleToRotate
        if (this._selected.selected && !entityToRotate) {
          // if (this._selected.selected && !this._objectPos.entityToRotateId) {
          this._objectPos.setEntityToRotate(this._selected.selected.id, this.currentTransformedCursor)
          return
        }

        if (this._selected.multiSelected.length > 0) {
          const multiSelectedIds = this._selected.multiSelected.map(entity => entity.id)
          this._objectPos.setMultipleToRotate(multiSelectedIds, this.currentTransformedCursor)
          return
        }
      }
        break
      case KEYS.C: {
        if (this._mode.mode === CANVAS_MODE.CREATE) {
          this._mode.setMode(CANVAS_MODE.SELECT)
          return
        }
        this._mode.setMode(CANVAS_MODE.CREATE)
      }
        break

    }
    /*    if (event.key === 'Escape') {
     this._selected.clearSelectedState()
     }
     /   if (event.shiftKey) {
     console.log('shift key up')
     // this._selected.isMultiSelectDragging = false
     }*!/
     if (event.key === KEYS.R) {
     console.log('r key up')
     if (this._objectPositioning.entityToRotateId) {
     this._objectPositioning.clearEntityToRotate()
     return
     }
     if (this._objectPositioning.multipleToRotateIds.length > 0 && !this._objectPositioning.entityToRotateId) {
     this._objectPositioning.clearEntityToRotate()
     return
     }
     if (this._selected.selected && !this._objectPositioning.entityToRotateId) {
     this._objectPositioning.setEntityToRotate(this._selected.selected.id, this.currentTransformedCursor)
     return
     }

     if (this._selected.multiSelected.length > 0) {
     const multiSelectedIds = this._selected.multiSelected.map(entity => entity.id)
     this._objectPositioning.setMultipleToRotate(multiSelectedIds, this.currentTransformedCursor)
     return
     }

     }*/
    /*  if (event.key === KEYS.G) {
     this.drawPanels()
     }
     if (event.key === KEYS.X) {
     if (this._selected.multiSelected.length > 0) {
     this._stringsService.createStringWithPanels(this._selected.getMultiSelectedByType(ENTITY_TYPE.Panel), this.strings)

     }
     }
     if (event.key === KEYS.C) {
     if (this._mode.mode === CANVAS_MODE.CREATE) {
     this._mode.setMode(CANVAS_MODE.SELECT)
     return
     }
     this._mode.setMode(CANVAS_MODE.CREATE)
     }*/
  }

  /*  private areAnyPanelRectsNearClick(point: Point) {
   const transformedPoint = this._domPointService.getTransformedPointFromXy(point)
   for (const object of this.entities) {
   const { location, width, height } = object
   const { x, y } = location
   const xDistance = Math.abs(transformedPoint.x - (x + width / 2))
   const yDistance = Math.abs(transformedPoint.y - (y + height / 2))
   const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
   const threshold = xDistance > yDistance
   ? object.width
   : object.height
   if (distance <= threshold) {
   console.log('isNearClick: ____ near click')
   return true
   }
   }
   return false
   }*/

  /*  private anyObjectsNearLocationExcludingGrabbed(point: TransformedPoint, grabbed: CanvasEntity) {
   // const transformedPoint = this._domPointService.getTransformedPointFromXy(point)
   // const scale = this._domPointService.scale
   for (const entity of this.entities) {
   if (entity.id === grabbed.id) continue
   const entityBounds = getEntityBounds(entity)
   return isPointInsideBounds(point, entityBounds)
   // return
   /!*     const { location, width, height } = object
   const transformedLocation = this._domPointService.getTransformedPointFromXy(location)
   const { x, y } = transformedLocation
   const xDistance = Math.abs(transformedPoint.x - (x + width / 2) + 10)
   const yDistance = Math.abs(transformedPoint.y - (y + height / 2) + 10)
   const distance = Math.sqrt(xDistance ** 2 + yDistance ** 2)
   const threshold = xDistance > yDistance
   ? object.width
   : object.height
   if (distance <= threshold) {
   console.log('isNearClick: ____ near click')
   return true
   }*!/
   }
   return false
   }*/

  /*  private animateSelectionBox(event: MouseEvent) {
   if (!this.selectionBoxStartPoint || !this.isSelectionBoxDragging || !event.altKey) {
   throw new Error('selection box not started')
   }
   const mousePointToScale = this._domPointService.getTransformedPointFromEvent(event)
   const width = mousePointToScale.x - this.selectionBoxStartPoint.x
   const height = mousePointToScale.y - this.selectionBoxStartPoint.y

   this.drawPanels()
   this.ctx.beginPath()
   this.ctx.globalAlpha = 0.4
   this.ctx.fillStyle = this.selectionBoxFillStyle
   this.ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
   this.ctx.fill()
   this.ctx.stroke()
   this.ctx.closePath()
   this.ctx.globalAlpha = 1.0
   this.ctx.fillStyle = this.defaultPanelFillStyle
   }*/

  /* private animateCreationBox(event: MouseEvent) {
   if (!this.selectionBoxStartPoint || !this.isSelectionBoxDragging || !event.altKey) {
   throw new Error('selection box not started')
   }
   const mousePointToScale = this._domPointService.getTransformedPointFromEvent(event)
   const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(this.selectionBoxStartPoint, mousePointToScale)
   if (!spots) return
   const diagonalDirection = getDiagonalDirectionFromTwoPoints(this.selectionBoxStartPoint, mousePointToScale)
   if (!diagonalDirection) return
   const entitySize = SizeByType[ENTITY_TYPE.Panel]

   const width = mousePointToScale.x - this.selectionBoxStartPoint.x
   const height = mousePointToScale.y - this.selectionBoxStartPoint.y

   this.drawPanels()
   this.ctx.save()
   this.ctx.beginPath()
   this.ctx.globalAlpha = 0.4
   this.ctx.fillStyle = this.creationBoxFillStyle
   this.ctx.rect(this.selectionBoxStartPoint.x, this.selectionBoxStartPoint.y, width, height)
   // this._ctx.rect(this.creationBoxStartPoint.x, this.creationBoxStartPoint.y, width, height)
   this.ctx.fill()
   this.ctx.stroke()
   this.ctx.restore()
   this.ctx.save()

   spots.forEach(spot => {
   this.ctx.beginPath()
   this.ctx.save()
   this.ctx.beginPath()
   this.ctx.globalAlpha = 0.4
   this.ctx.fillStyle = spot.vacant
   ? this.previewPanelFillStyle
   : this.takenSpotFillStyle
   this.ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
   this.ctx.fill()
   this.ctx.stroke()
   this.ctx.restore()
   })
   this.ctx.restore()
   }*/

  /*  private getStartingSpotForCreationBox(direction: DiagonalDirection, size: ObjectSize) {
   switch (direction) {
   case DIAGONAL_DIRECTION.TopLeftToBottomRight:
   return {
   x: 0,
   y: 0,
   }
   case DIAGONAL_DIRECTION.TopRightToBottomLeft:
   return {
   x: -size.width,
   y: 0,
   }
   case DIAGONAL_DIRECTION.BottomLeftToTopRight:
   return {
   x: 0,
   y: -size.height,
   }
   case DIAGONAL_DIRECTION.BottomRightToTopLeft:
   return {
   x: -size.width,
   y: -size.height,
   }
   }
   }*/

  /*  private getMouseOverPanel(event: MouseEvent) {
   const mouseOverPanels = this._entities.filter(panel => this.isMouseOverPanel(event, panel))
   return mouseOverPanels[mouseOverPanels.length - 1]
   }

   private isMouseOverPanel(event: MouseEvent, panel: CanvasEntity) {
   const { x, y } = this._domPointService.getTransformedPointFromEvent(event)
   const { location, width, height } = panel
   return x >= location.x && x <= location.x + width && y >= location.y && y <= location.y + height
   }

   private getEntitiesUnderMouse(event: MouseEvent) {
   return this.entities.filter(entity => this.isMouseOverEntityBounds(event, entity))
   }*/

  /*  private getEntityUnderMouse(event: MouseEvent) {
   const entitiesUnderMouse = this.entities.filter(entity => this.isMouseOverEntityBounds(event, entity))
   return entitiesUnderMouse[entitiesUnderMouse.length - 1]
   }

   private isMouseOverEntityBounds(event: MouseEvent, entity: CanvasEntity) {
   const point = this._domPointService.getTransformedPointFromEvent(event)
   const entityBounds = getEntityBounds(entity)
   return isPointInsideBounds(point, entityBounds)
   }*/

  /* private drawPanel(panel: CanvasEntity) {
   assertIsPanel(panel)

   let fillStyle = this.defaultPanelFillStyle

   const isBeingHovered = this.hoveringEntityId === panel.id
   if (isBeingHovered) {
   fillStyle = '#17fff3'
   }

   const isSingleSelected = this._selected.selected && this._selected.selected.id === panel.id
   const isMultiSelected = this._selected.multiSelected && this._selected.multiSelected.find(selected => selected.id === panel.id)

   if (isSingleSelected) {
   fillStyle = '#ff6e78'
   }

   if (isMultiSelected) {
   fillStyle = '#ff6e78'
   }

   const stringIsSelected = !!this._selected.selectedStringId
   const panelStringIsSelected = this._selected.selectedStringId === panel.stringId
   if (panelStringIsSelected) {
   const panelString = this._strings.find(string => string.id === panel.stringId)
   assertNotNull(panelString, 'panelString should not be null')
   if (this._selected.selectedStringId === panelString.id) {
   fillStyle = panelString.color
   }
   }
   const otherPanelStringIsSelected = stringIsSelected && !panelStringIsSelected
   if (otherPanelStringIsSelected) {
   fillStyle = '#afb8d8'
   }

   const isInMultiRotate = this._objectPositioning.multipleToRotateIds.includes(panel.id)
   const isInSingleRotate = this._objectPositioning.entityToRotateId === panel.id

   if (isInMultiRotate) {
   // this.handleMultiRotateDrawDifferently()
   return
   }
   if (isInSingleRotate) {
   return
   // return this.handleSingleRotateDraw(panel)
   }

   this.ctx.save()
   this.ctx.fillStyle = fillStyle
   this.ctx.translate(panel.location.x + panel.width / 2, panel.location.y + panel.height / 2)
   this.ctx.rotate(panel.angle)
   // this._ctx.rotate(panel.angle * Math.PI / 180)
   this.ctx.beginPath()
   this.ctx.rect(-panel.width / 2, -panel.height / 2, panel.width, panel.height)
   this.ctx.fill()
   this.ctx.stroke()

   this.ctx.restore()
   }

   private handleSingleRotateDraw(panel: CanvasPanel) {
   this.ctx.save()
   this.ctx.translate(panel.location.x + panel.width / 2, panel.location.y + panel.height / 2)
   assertNotNull(this._objectPositioning.entityToRotateAngle, 'entityToRotateAngle should not be null')
   this.ctx.rotate(this._objectPositioning.entityToRotateAngle)
   // this._ctx.rotate(this._objectPositioning.entityToRotateAngle * Math.PI / 180)
   this.ctx.beginPath()
   this.ctx.rect(-panel.width / 2, -panel.height / 2, panel.width, panel.height)
   this.ctx.fill()
   this.ctx.stroke()
   // this._ctx.closePath()
   this.ctx.restore()
   }

   drawWithUpdated() {
   if (this._objectPositioning.singleRotateMode && this._objectPositioning.entityToRotateId) {
   const panel = this._entities.find(panel => panel.id === this._objectPositioning.entityToRotateId)
   assertNotNull(panel, 'panel should not be null')
   this.handleSingleRotateDraw(panel)
   return
   }

   if (!this._objectPositioning.areAnyEntitiesInRotate) return
   const multipleToRotateIds = this._objectPositioning.multipleToRotateIds
   const entities = this._entities.filter(panel => multipleToRotateIds.includes(panel.id))
   this.ctx.save()
   entities.forEach(entity => {
   this.ctx.save()
   const angle = this._objectPositioning.multipleToRotateAdjustedAngle.get(entity.id)
   const location = this._objectPositioning.multipleToRotateAdjustedLocation.get(entity.id)
   assertNotNull(angle)
   assertNotNull(location)
   this.ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
   this.ctx.rotate(angle)

   this.ctx.beginPath()
   if (entity.id === entities[0].id) {
   this.ctx.fillStyle = '#17fff3'
   }
   this.ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
   this.ctx.fill()
   this.ctx.stroke()
   this.ctx.restore()
   })

   this.ctx.restore()
   }

   private drawPivotPoint() {
   if (!this._objectPositioning.pivotPoint) return
   this.ctx.save()
   this.ctx.beginPath()
   this.ctx.strokeStyle = '#ff6e78'
   this.ctx.fillStyle = '#ff6e78'
   this.ctx.lineWidth = 1
   // assertNotNull(this._objectPositioning.pivotPoint)
   this.ctx.arc(this._objectPositioning.pivotPoint.x, this._objectPositioning.pivotPoint.y, 5, 0, 2 * Math.PI)
   this.ctx.closePath()
   this.ctx.fill()
   this.ctx.stroke()
   this.ctx.restore()
   }

   private drawPanels() {
   this.delayedLogger.log('draw panels')
   const rotateState: RotateState = {
   singleToRotateId:            this._objectPositioning.entityToRotateId,
   singleToRotateAngle:         this._objectPositioning.entityToRotateAngle,
   multipleToRotateIds:         this._objectPositioning.multipleToRotateIds,
   multipleToRotateAngleMap:    this._objectPositioning.multipleToRotateAdjustedAngle,
   multipleToRotateLocationMap: this._objectPositioning.multipleToRotateAdjustedLocation,
   }
   drawEntities(
   this.ctx,
   this.canvas,
   this._entities,
   this.appState,
   rotateState,
   )
   // this._draw.drawEntities()
   /!*    this.resetCanvas()
   this.drawPivotPoint()
   this._ctx.beginPath()
   this._panels.forEach(panel => {
   this.drawPanel(panel)
   })
   this.drawWithUpdated()
   // this.handleMultiRotateDrawDifferently()
   // this.handleMultiRotateDrawV2()
   this._ctx.closePath()*!/
   }

   private resetCanvas() {
   this.ctx.save()
   this.ctx.setTransform(1, 0, 0, 1, 0, 0)
   this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
   this.ctx.restore()
   }

   private drawPanelsNoClear() {
   console.log('draw panels no clear')
   this.ctx.beginPath()
   this._entities.forEach(panel => {
   this.drawPanel(panel)
   })
   this.ctx.closePath()
   }
   */
  /*getAllElementsBetweenTwoPoints(
   point1: TransformedPoint,
   point2: TransformedPoint,
   ) {
   // const objectRects = this._componentElementsService.getComponentElementRectsWithId()
   const elementsBetweenPoints = this.panels.filter((objectRect) => {
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
   /!*  return elementsBetweenPoints.map((element) => ({
   id: element.id,
   type: element.type,
   }))*!/
   }*/

  /*  private updateToBackOfArray(entity: CanvasEntity, changes: Partial<CanvasEntity>) {
   const index = this._entities.findIndex((panel) => panel.id === entity.id)
   const newPanel = { ...entity, ...changes }
   this._entities.splice(index, 1)
   this._entities.push(newPanel as CanvasPanel)
   this.drawPanels()
   }

   private updateToLocalArray(entityId: string, changes: Partial<CanvasPanel>) {
   const panel = this._entities.find((panel) => panel.id === entityId)
   const index = this._entities.findIndex((panel) => panel.id === panel.id)
   const newPanel = { ...panel, ...changes }
   this._entities.splice(index, 1)
   this._entities.push(newPanel as CanvasPanel)
   console.log('updated local array', newPanel)
   this.drawPanels()
   /!*    const panel = this._panels.find((panel) => panel.id === entityId)
   const index = this._panels.findIndex((panel) => panel.id === panel.id)
   const newPanel = { ...panel, ...changes }
   // update at current index
   this._panels.splice(index, 1, newPanel as CanvasPanel)
   // this._panels.splice(index, 1, newPanel as CanvasPanel)
   this.drawPanels()*!/
   }*/
  /*
   private getLiveSelectedPanel() {
   const selectedId = this._selected.selected?.id
   assertNotNull(selectedId)
   return this._entities.find((panel) => panel.id === selectedId) as CanvasEntity
   }

   private getLiveSelectedPanelById(id: string) {
   return this._entities.find((panel) => panel.id === id) as CanvasEntity
   }*/
}
