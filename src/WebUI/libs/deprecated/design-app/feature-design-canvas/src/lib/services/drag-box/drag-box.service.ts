/*
 import { inject, Injectable } from '@angular/core'
 import { CanvasElementService } from '../canvas-element.service'
 import { AXIS, Axis, CANVAS_COLORS, createPanel, SizeByType, TransformedPoint } from '../../types'
 import { CURSOR_TYPE } from '@shared/data-access/models'
 import { DomPointService } from '../dom-point.service'
 import { CanvasObjectPositioningService } from '../canvas-object-positioning.service'
 import { assertNotNull } from '@shared/utils'
 // import { CanvasEntitiesStore } from './canvas-entities'
 import { changeCanvasCursor, dragBoxKeysDown, EntityBounds, getAllAvailableEntitySpotsBetweenTwoPoints, getAllEntitiesBetweenTwoPoints } from '../../utils'
 import { CANVAS_MODE, canvasAppXStateService, CanvasClientStateService } from '../canvas-client-state'
 import { CanvasRenderService } from '../canvas-render'
 import { ENTITY_TYPE } from '@design-app/shared'

 @Injectable({
 providedIn: 'root',
 })
 export class DragBoxService {
 private _canvasElementService = inject(CanvasElementService)
 private _domPointService = inject(DomPointService)
 private _objectPositioning = inject(CanvasObjectPositioningService)
 private _state = inject(CanvasClientStateService)
 private _render = inject(CanvasRenderService)

 get ctx() {
 return this._canvasElementService.ctx
 }

 get canvas() {
 return this._canvasElementService.canvas
 }

 get scale() {
 return this.ctx.getTransform().a
 }

 get rect() {
 return this._canvasElementService.rect
 }

 handleDragBoxMouseDown(event: PointerEvent) {
 this._state.updateState({
 dragBox: {
 dragBoxStart: this._domPointService.getTransformedPointFromEvent(event),
 },
 })
 const { mode } = this._state.mode
 if (mode === CANVAS_MODE.SELECT) {
 canvasAppXStateService.send({
 type:    'StartSelectionBox',
 payload: {
 point: this._domPointService.getTransformedPointFromEvent(event),
 },
 })
 }
 // DragBoxMachineService.send('Start Drag Box')
 }

 selectionBoxMouseUp(event: PointerEvent) {
 const start = this._state.dragBox.dragBoxStart
 assertNotNull(start)
 const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
 const panelsInArea = getAllEntitiesBetweenTwoPoints(start, currentPoint, this._state.entities.canvasEntities.getEntities())

 if (panelsInArea) {
 const entitiesInAreaIds = panelsInArea.map(panel => panel.id)
 // const entities = mapToObject(panelsInArea)

 this._state.updateState({
 selected: {
 multipleSelectedIds: entitiesInAreaIds,
 singleSelectedId:    undefined,
 },
 })

 canvasAppXStateService.send({
 type:    'SelectionBoxCompleted',
 payload: {
 ids: entitiesInAreaIds,
 },
 })

 }
 }

 creationBoxMouseUp(event: PointerEvent) {
 const { dragBoxStart } = this._state.dragBox
 assertNotNull(dragBoxStart)
 const currentPoint = this._domPointService.getTransformedPointFromEvent(event)
 const spots = this._objectPositioning.getAllAvailableEntitySpotsBetweenTwoPoints(dragBoxStart, currentPoint)
 if (!spots || !spots.length) return
 const takenSpots = spots.filter(spot => !spot.vacant)
 if (takenSpots.length) {
 console.log('taken spots', takenSpots)
 return
 }
 const newPanels = spots.map(spot =>
 createPanel({ x: spot.x, y: spot.y }),
 )
 this._state.updateState({
 dragBox: {
 dragBoxStart: undefined,
 },
 })
 this._state.entities.canvasEntities.addManyEntities(newPanels)
 }

 dragBoxMouseMove(event: PointerEvent) {
 console.log('drag box mouse move', event.altKey)
 if (!dragBoxKeysDown(event)) {
 console.log('drag box mouse move ALT KEY LIFTED')
 this._state.updateState({
 dragBox: {
 dragBoxStart: undefined,
 },
 })
 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
 this._render.drawCanvas()
 return
 }
 const { dragBoxStart } = this._state.dragBox
 if (!dragBoxStart) {
 return
 }
 this._render.drawDragBox(event)
 }

 dragBoxMouseUp(event: PointerEvent) {
 const { mode } = this._state.mode
 switch (mode) {
 case CANVAS_MODE.CREATE:
 this.creationBoxMouseUp(event)
 break
 case CANVAS_MODE.SELECT:
 this.selectionBoxMouseUp(event)
 break
 }
 this._state.updateState({
 dragBox: {
 dragBoxStart: undefined,
 },
 })
 this._render.drawCanvas()
 }

 dragAxisLineMouseMove(event: PointerEvent, currentPoint: TransformedPoint, dragBoxAxisLineStart: TransformedPoint) {
 if (!dragBoxKeysDown(event)) {
 console.log('drag box mouse move ALT KEY LIFTED')
 this._state.updateState({
 grid:    {
 currentAxis: undefined,
 },
 dragBox: {
 axisLineStart: undefined,
 },
 })
 changeCanvasCursor(this.canvas, CURSOR_TYPE.AUTO)
 this._render.drawCanvas()
 return
 }
 const currentAxis = this._state.grid.currentAxis
 if (!currentAxis) {
 throw new Error('dragAxisLineMouseMove: currentAxis is undefined')
 }

 const axisLineBounds = currentAxis === AXIS.X
 ? this._state.grid.xAxisLineBounds
 : this._state.grid.yAxisLineBounds
 if (!axisLineBounds) {
 throw new Error('dragAxisLineMouseMove: axisLineBounds is undefined')
 }
 const entitySize = SizeByType[ENTITY_TYPE.Panel]
 const [startX, startY, endX, endY] = getStartAndEndForAxisLineDragBox(dragBoxAxisLineStart, currentPoint, currentAxis, axisLineBounds)

 const start = { x: startX, y: startY } as TransformedPoint
 const end = { x: endX, y: endY } as TransformedPoint
 const spots = getAllAvailableEntitySpotsBetweenTwoPoints(start, end, this._state.entities.canvasEntities.getEntities())
 console.log('spots', spots)
 if (!spots || !spots.length) {
 console.log('start', start)
 console.log('end', end)
 return
 }

 const axisLineDragBoxCtxFn = (ctx: CanvasRenderingContext2D) => {
 ctx.save()
 spots.forEach(spot => {
 ctx.save()
 ctx.beginPath()
 ctx.globalAlpha = 0.6
 ctx.fillStyle = spot.vacant
 ? CANVAS_COLORS.PreviewPanelFillStyle
 : CANVAS_COLORS.TakenSpotFillStyle
 ctx.rect(spot.x, spot.y, entitySize.width, entitySize.height)
 ctx.fill()
 ctx.stroke()
 ctx.restore()
 })
 ctx.restore()
 }

 this._render.drawCanvasWithFunction(axisLineDragBoxCtxFn)
 }
 }

 export const getStartAndEndForAxisLineDragBox = (start: TransformedPoint, end: TransformedPoint, axis: Axis, axisLineBounds: EntityBounds) => {
 switch (axis) {
 case AXIS.X:
 return [
 axisLineBounds.left,
 start.y,
 axisLineBounds.right,
 end.y,
 ]
 case AXIS.Y:
 return [
 axisLineBounds.left,
 start.y,
 axisLineBounds.right,
 end.y,
 ]
 }
 }

 export const adjustPointToGridByAxisLine = (point: TransformedPoint, axis: Axis, axisLineBounds: EntityBounds) => {
 switch (axis) {
 case AXIS.X:
 return {
 x: point.x,
 y: axisLineBounds.centerY,
 }
 case AXIS.Y:
 return {
 x: axisLineBounds.centerX,
 y: point.y,
 }
 }
 }*/
