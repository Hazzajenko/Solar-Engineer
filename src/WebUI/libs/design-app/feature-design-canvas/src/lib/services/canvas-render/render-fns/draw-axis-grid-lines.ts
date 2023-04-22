import { CANVAS_COLORS } from '../../../types'
import { getEntityAxisGridLinesByAxisV2 } from '../../../utils'
import { NearbyEntity } from '../../canvas-client-state'
// import { fn } from '@angular/compiler'
import { nonNullish } from '@shared/utils'

export const drawEntityGridLines = (nearbyEntity: NearbyEntity) => {
  const gridLines = getEntityAxisGridLinesByAxisV2(nearbyEntity.bounds, nearbyEntity.axis)
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
}

export const drawManyEntityGridLines = (nearbyEntities: NearbyEntity[]) => {
  return nearbyEntities.map((ent) => drawEntityGridLines(ent))
}

export const drawAxisGridLines = (nearbyEntitiesOnAxis: NearbyEntity[][]) => {
  return nearbyEntitiesOnAxis
    .map((axisEntities) => {
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
    })
    .filter(nonNullish)
  /*  return (ctx: CanvasRenderingContext2D) => {
   ctxFns.forEach((fn) => fn(ctx))
   }*/
  /*  return {
   ctxFn,
   changes: [],
   }*/
}