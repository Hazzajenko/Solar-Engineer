import { findNearbyBoundOverlapOnBothAxis } from '../../object-positioning/utils'
import {
  AXIS,
  CANVAS_COLORS,
  CanvasClientStateService,
  CanvasEntity,
  drawAxisGridLines,
  EntityBounds,
  getBoundsFromCenterPoint,
  getCornerPointsFromAxisPosition,
  getOppositeSameAxisPosition,
  getSameAxisPosition,
  isEntityOverlappingWithBounds,
  NearbyEntity,
  ObjectSize,
  StateUpdate,
  TransformedPoint,
} from '@design-app/feature-design-canvas'
import { groupInto2dArray, mapToDictionary } from '@shared/utils'
import { sortBy } from 'lodash'

export const getDrawPreviewEntityFn = (
  point: TransformedPoint,
  size: ObjectSize,
  entities: CanvasEntity[],
) => {
  const mouseBoxBounds = getBoundsFromCenterPoint(point, size)
  const anyNearClick = !!entities.find((entity) =>
    isEntityOverlappingWithBounds(entity, mouseBoxBounds),
  )

  const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)
  if (nearbyEntitiesOnAxis.length) {
    /*    const nearbyX = nearbyEntitiesOnAxis.filter((entity) => entity.axis === 'x')
     if (nearbyX.length) {
     console.log('nearbyX', nearbyX)
     }
     const nearbyY = nearbyEntitiesOnAxis.filter((entity) => entity.axis === 'y')
     if (nearbyY.length) {
     console.log('nearbyY', nearbyY)
     }*/
  }

  // const nearbyEntitiesOnAxis = findNearbyAxisBounds(mouseBoxBounds, entities)
  // console.log('nearbyEntitiesOnAxis', nearbyEntitiesOnAxis)

  const fillStyle = anyNearClick
    ? CANVAS_COLORS.TakenSpotFillStyle
    : CANVAS_COLORS.PreviewPanelFillStyle
  return (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.beginPath()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = fillStyle
    // ctx.fillStyle = CANVAS_COLORS.TakenSpotFillStyle
    ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}

export const getDrawPreviewEntityFnV2 = (
  point: TransformedPoint,
  size: ObjectSize,
  state: CanvasClientStateService,
) => {
  const mouseBoxBounds = getBoundsFromCenterPoint(point, size)
  const entities = state.entities.canvasEntities.getEntities()
  const anyNearClick = !!entities.find((entity) =>
    isEntityOverlappingWithBounds(entity, mouseBoxBounds),
  )

  const nearbyEntitiesOnAxis = findNearbyBoundOverlapOnBothAxis(mouseBoxBounds, entities)

  if (!nearbyEntitiesOnAxis.length) {
    const ctxFn = (ctx: CanvasRenderingContext2D) => {
      ctx.save()
      ctx.beginPath()
      ctx.globalAlpha = 0.4
      ctx.fillStyle = CANVAS_COLORS.PreviewPanelFillStyle
      ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }
    return {
      ctxFn,
      changes: {
        nearby: {
          ids: [],
          entities: {},
        },
      },
    }
  }
  const changes: StateUpdate = {
    nearby: {
      ids: nearbyEntitiesOnAxis.map((entity) => entity.id),
      entities: mapToDictionary(nearbyEntitiesOnAxis),
    },
  }

  const fillStyle = anyNearClick
    ? CANVAS_COLORS.TakenSpotFillStyle
    : CANVAS_COLORS.PreviewPanelFillStyle

  // const nearbyChain = chain(nearbyEntitiesOnAxis)
  /*  const nearbySortedByDistance2 = chain(nearbyEntitiesOnAxis)
   .sortBy((entity) => Math.abs(entity.distance))
   .groupBy('axis')
   .value()*/

  const nearbySortedByDistance = sortBy(nearbyEntitiesOnAxis, (entity) => Math.abs(entity.distance))

  const nearby2dArray = groupInto2dArray(nearbySortedByDistance, 'axis')
  const axisGridLineCtxFns = drawAxisGridLines(nearby2dArray)
  // axisGridLineCtxFns.ctxFn
  /* const nearbyMap = groupIntoMap(nearbySortedByDistance, 'axis')
   const nearbyX = nearbyMap.get(AXIS.X)
   const nearbyY = nearbyMap.get(AXIS.Y)

   const splitAxis = groupBy(nearbySortedByDistance, 'axis')
   const yAxis = splitAxis[AXIS.Y]
   const xAxis = splitAxis[AXIS.X]

   const ctxFns: ((ctx: CanvasRenderingContext2D) => void)[] = []

   const axisArray = [xAxis, yAxis]

   axisArray.forEach((axisEntities) => {
   if (axisEntities && axisEntities.length) {
   const closestEnt = axisEntities[0]
   if (closestEnt) {
   const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
   ctxFns.push((ctx: CanvasRenderingContext2D) => {
   ctx.save()
   ctx.beginPath()
   ctx.globalAlpha = 0.4
   ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
   ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
   ctx.moveTo(gridLines[0][0], gridLines[0][1])
   ctx.lineTo(gridLines[0][2], gridLines[0][3])
   ctx.moveTo(gridLines[1][0], gridLines[1][1])
   ctx.lineTo(gridLines[1][2], gridLines[1][3])
   ctx.stroke()
   ctx.restore()
   })
   }
   }
   })

   const entityGridLineCtxFns = drawManyEntityGridLines(nearbyEntitiesOnAxis)

   const axisGridLinesCtxFn = axisArray.map((axisEntities) => {
   if (!axisEntities || !axisEntities.length) return
   const closestEnt = axisEntities[0]
   if (!closestEnt) return
   const gridLines = getEntityAxisGridLinesByAxisV2(closestEnt.bounds, closestEnt.axis)
   return (ctx: CanvasRenderingContext2D) => {
   ctx.save()
   ctx.beginPath()
   ctx.globalAlpha = 0.4
   ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
   ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
   ctx.moveTo(gridLines[0][0], gridLines[0][1])
   ctx.lineTo(gridLines[0][2], gridLines[0][3])
   ctx.moveTo(gridLines[1][0], gridLines[1][1])
   ctx.lineTo(gridLines[1][2], gridLines[1][3])
   ctx.stroke()
   ctx.restore()
   }
   })*/
  const ctxFn = (ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.beginPath()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = fillStyle
    ctx.rect(mouseBoxBounds.left, mouseBoxBounds.top, size.width, size.height)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
    axisGridLineCtxFns.forEach((fn) => fn(ctx))
  }

  return {
    ctxFn,
    changes,
  }
}

export const drawEntityGridLinesByAxis = (
  ctx: CanvasRenderingContext2D,
  nearbyEntity: NearbyEntity,
) => {
  const axis = nearbyEntity.axis

  ctx.save()
  ctx.beginPath()
  ctx.globalAlpha = 0.4
  ctx.strokeStyle = CANVAS_COLORS.NearbyPanelStrokeStyle
  ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle

  ctx.moveTo(nearbyEntity.bounds.left, nearbyEntity.bounds.top)
  /*  ctx.moveTo(nearbyEntity.bounds.left, nearbyEntity.bounds.top)
   ctx.lineTo(nearbyEntity.bounds.left + nearbyEntity.bounds.width, nearbyEntity.bounds.top)
   ctx.lineTo(nearbyEntity.bounds.left + nearbyEntity.bounds.width, nearbyEntity.bounds.top + nearbyEntity.bounds.height)
   ctx.lineTo(nearbyEntity.bounds.left, nearbyEntity.bounds.top + nearbyEntity.bounds.height)*/
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

export const drawEntityGridLinesDeprecated = (
  ctx: CanvasRenderingContext2D,
  nearbyEntity: NearbyEntity,
  mouseBoxBounds: EntityBounds,
) => {
  const ctxFns: ((ctx: CanvasRenderingContext2D) => void)[] = []
  const axisPos = getSameAxisPosition(mouseBoxBounds, nearbyEntity.bounds, AXIS.Y)
  if (!axisPos) {
    return []
  }
  const points1 = getCornerPointsFromAxisPosition(axisPos, nearbyEntity.bounds)
  const oppositeAxisPos = getOppositeSameAxisPosition(axisPos)
  const points2 = getCornerPointsFromAxisPosition(oppositeAxisPos, mouseBoxBounds)
  ctxFns.push((ctx: CanvasRenderingContext2D) => {
    ctx.save()
    ctx.beginPath()
    ctx.globalAlpha = 0.4
    ctx.fillStyle = CANVAS_COLORS.NearbyPanelFillStyle
    ctx.moveTo(points1[0].x, points1[0].y)
    ctx.lineTo(points1[1].x, points1[1].y)
    ctx.lineTo(points2[1].x, points2[1].y)
    ctx.lineTo(points2[0].x, points2[0].y)
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  })
  return ctxFns
}