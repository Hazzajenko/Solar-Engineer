import { AngleRadians, CANVAS_COLORS, CanvasAppState, CanvasEntity } from '@design-app/feature-design-canvas';
import { Point } from '@shared/data-access/models';
import { assertNotNull } from '@shared/utils';


/*export const resetCanvas = (ctx: CanvasRenderingContext2D) => {
 ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
 ctx.fillStyle = CANVAS_COLORS.DefaultPanelFillStyle
 ctx.strokeStyle = CANVAS_COLORS.DefaultPanelStrokeStyle
 ctx.lineWidth = 1
 }*/

export type RotateState = {
  singleToRotateId: string | undefined
  singleToRotateAngle: AngleRadians | undefined
  multipleToRotateIds: string[]
  multipleToRotateAngleMap: Map<string, AngleRadians>
  multipleToRotateLocationMap: Map<string, Point>
}
export const drawEntities = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  entities: CanvasEntity[],
  appState: CanvasAppState,
  rotateState: RotateState,
) => {
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.restore()
  ctx.beginPath()
  entities.forEach((entity) => {
    drawEntity(ctx, entity, appState, rotateState)
  })
  ctx.closePath()
}

export const drawEntity = (
  ctx: CanvasRenderingContext2D,
  entity: CanvasEntity,
  appState: CanvasAppState,
  rotateState: RotateState,
) => {
  let fillStyle: string = CANVAS_COLORS.DefaultPanelFillStyle
  // let fillStyle = this.defaultPanelFillStyle

  const isBeingHovered = appState.hoveringEntityId === entity.id
  if (isBeingHovered) {
    fillStyle = '#17fff3'
  }

  const isSingleSelected = appState.selectedId === entity.id
  const isMultiSelected =
    appState.selectedIds && appState.selectedIds.find((id) => id === entity.id)

  if (isSingleSelected) {
    fillStyle = '#ff6e78'
  }

  if (isMultiSelected) {
    fillStyle = '#ff6e78'
  }

  const isInMultiRotate = rotateState.multipleToRotateIds.includes(entity.id)
  const isInSingleRotate = rotateState.singleToRotateId === entity.id

  if (isInMultiRotate) {
    handleMultipleRotationDraw(ctx, entity, rotateState)
    return
  }
  if (isInSingleRotate) {
    handleSingleRotationDraw(ctx, entity, rotateState)
    return
  }

  ctx.save()
  ctx.fillStyle = fillStyle
  ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
  ctx.rotate(entity.angle)
  ctx.beginPath()
  ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

const handleSingleRotationDraw = (
  ctx: CanvasRenderingContext2D,
  entity: CanvasEntity,
  rotateState: RotateState,
) => {
  const angle = rotateState.singleToRotateAngle
  assertNotNull(angle)
  ctx.save()
  ctx.translate(entity.location.x + entity.width / 2, entity.location.y + entity.height / 2)
  ctx.rotate(angle)
  ctx.beginPath()
  ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

const handleMultipleRotationDraw = (
  ctx: CanvasRenderingContext2D,
  entity: CanvasEntity,
  rotateState: RotateState,
) => {
  const angle = rotateState.multipleToRotateAngleMap.get(entity.id)
  const location = rotateState.multipleToRotateLocationMap.get(entity.id)
  assertNotNull(angle)
  assertNotNull(location)

  ctx.save()
  ctx.translate(location.x + entity.width / 2, location.y + entity.height / 2)
  ctx.rotate(angle)

  ctx.beginPath()
  ctx.rect(-entity.width / 2, -entity.height / 2, entity.width, entity.height)
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}
/*

 export const resetCanvas = (ctx: CanvasRenderingContext2D) => {
 ctx.save()
 ctx.setTransform(1, 0, 0, 1, 0, 0)
 ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
 ctx.restore()
 }*/