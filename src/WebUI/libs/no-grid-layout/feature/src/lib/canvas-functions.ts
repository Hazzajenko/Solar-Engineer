import { FreeBlockRectModel } from './free-block-rect.model'
import { LineDirectionEnum } from './line-direction.enum'
import { PanelStylerService } from './panel-styler.service'
import { BlockRectModel } from '@grid-layout/data-access'

export function drawLineForAboveBlock(
  blockRectModel: BlockRectModel,
  cachedPanels: FreeBlockRectModel[],
  ctx: CanvasRenderingContext2D,
  panelStylerService: PanelStylerService,
) {
  const printDefault = () => {
    ctx.beginPath()
    ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
    ctx.lineTo(blockRectModel.x, 0)
    ctx.stroke()

    const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
    const absoluteDistance = Math.abs(distanceToTopOfPage)
    ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, 50)
    // this.removePanelClassForLightUpPanels(LineDirectionEnum.Top)
    panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Top)
    return
  }
  if (!cachedPanels) {
    return printDefault()
  }
  const panelRectsToCheck = cachedPanels.filter(
    (rect) =>
      blockRectModel.x >= rect.x - rect.width / 2 &&
      blockRectModel.x <= rect.x + rect.width / 2 &&
      blockRectModel.y > rect.y,
  )
  if (!panelRectsToCheck.length) {
    return printDefault()
  }
  const panelRectsToCheckWithDistance = panelRectsToCheck.map((rect) => {
    const distance = Math.abs(rect.y - blockRectModel.y)
    return { ...rect, distance }
  })
  const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort(
    (a, b) => a.distance - b.distance,
  )
  const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
  if (!closestPanelRect) return printDefault()

  ctx.beginPath()
  ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
  ctx.lineTo(blockRectModel.x, closestPanelRect.y + closestPanelRect.height / 2)
  ctx.stroke()

  const distanceToClosestPanel =
    closestPanelRect.y +
    closestPanelRect.height / 2 -
    (blockRectModel.y - blockRectModel.height / 2)
  const absoluteDistance = Math.abs(distanceToClosestPanel)
  ctx.fillText(
    `${absoluteDistance}px`,
    blockRectModel.x - 50,
    blockRectModel.y - blockRectModel.height / 2 - 50,
  )

  // this.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Top)
  panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Top)
}