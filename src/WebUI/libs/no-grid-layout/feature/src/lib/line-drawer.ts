import { BlockRectModel } from '@grid-layout/data-access'

class LineDrawer {
  private readonly canvas: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private readonly lineWidth = 2
  private readonly lineColor = 'red'
  private readonly labelColor = 'red'
  private readonly labelFont = '15px Arial'
  private readonly panelOverlapThreshold = 0.5
  private cachedPanels: BlockRectModel[] | undefined

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('No canvas context found')
    }

    this.ctx = ctx
  }

  animateLinesFromBlock(blockRectModel: BlockRectModel) {
    this.clearCanvas()
    this.drawLines(blockRectModel)
    this.labelDistances(blockRectModel)
  }

  private clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  private drawLines(blockRectModel: BlockRectModel) {
    this.ctx.lineWidth = this.lineWidth
    this.ctx.strokeStyle = this.lineColor

    this.drawLineForAboveBlock(blockRectModel)
    this.drawLineForBelowBlock(blockRectModel)
    this.drawLineForLeftBlock(blockRectModel)
    this.drawLineForRightBlock(blockRectModel)
  }

  private drawLineForBelowBlock(blockRectModel: BlockRectModel) {
    const { x, y, height } = blockRectModel
    const { width } = this.canvas
    const { cachedPanels, ctx, lineColor } = this

    const closestPanelRect = this.getClosestPanelRect(x, y + height / 2, cachedPanels, true)

    if (closestPanelRect) {
      const { x: panelX, y: panelY, height: panelHeight } = closestPanelRect
      ctx.beginPath()
      ctx.moveTo(x, y + height / 2)
      ctx.lineTo(x, panelY - panelHeight / 2)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y + height / 2)
      ctx.lineTo(x, this.canvas.height)
      ctx.stroke()
    }
  }

  private drawLineForAboveBlock(blockRectModel: BlockRectModel) {
    const { x, y, height } = blockRectModel
    const { cachedPanels, ctx, lineColor } = this

    const closestPanelRect = this.getClosestPanelRect(x, y - height / 2, cachedPanels, false)

    if (closestPanelRect) {
      const { x: panelX, y: panelY, height: panelHeight } = closestPanelRect
      ctx.beginPath()
      ctx.moveTo(x, y - height / 2)
      ctx.lineTo(x + 1, panelY + panelHeight / 2)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(x, y - height / 2)
      ctx.lineTo(x, 0)
      ctx.stroke()
    }
  }

  private drawLineForLeftBlock(blockRectModel: BlockRectModel) {
    const { x, y, width, height } = blockRectModel
    const { cachedPanels, ctx, lineColor } = this

    const closestPanelRect = this.getClosestPanelRect(x - width / 2, y, cachedPanels, false)

    if (closestPanelRect) {
      const { x: panelX, y: panelY, width: panelWidth, height: panelHeight } = closestPanelRect
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y)
      ctx.lineTo(panelX + panelWidth / 2, panelY + panelHeight / 2)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(x - width / 2, y)
      ctx.lineTo(0, y)
      ctx.stroke()
    }
  }

  private drawLineForRightBlock(blockRectModel: BlockRectModel) {
    const { x, y, width, height } = blockRectModel
    const { cachedPanels, ctx, lineColor } = this

    const closestPanelRect = this.getClosestPanelRect(x + width / 2, y, cachedPanels, true)

    if (closestPanelRect) {
      const { x: panelX, y: panelY, width: panelWidth, height: panelHeight } = closestPanelRect
      ctx.beginPath()
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(panelX - panelWidth / 2, panelY + panelHeight / 2)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(x + width / 2, y)
      ctx.lineTo(this.canvas.width, y)
      ctx.stroke()
    }
  }

  private labelDistances(blockRectModel: BlockRectModel) {
    const { x, y, width, height } = blockRectModel
    const { ctx, labelColor, labelFont } = this

    const distanceToTopOfPage = y - height / 2
    ctx.fillStyle = labelColor
    ctx.font = labelFont
    ctx.fillText(`${distanceToTopOfPage}px`, x - 50, 50)

    const distanceToBottomOfPage = this.canvas.height - (y + height / 2)
    ctx.fillStyle = labelColor
    ctx.font = labelFont
    ctx.fillText(`${distanceToBottomOfPage}px`, x - 50, this.canvas.height - 50)
  }

  private getClosestPanelRect(
    x: number,
    y: number,
    panelRects: BlockRectModel[] | undefined,
    isRight: boolean,
  ): BlockRectModel | undefined {
    if (!panelRects) {
      return undefined
    }

    const panelRectsToCheckWithDistance = panelRects.map((rect) => {
      const { x: panelX, y: panelY, width: panelWidth, height: panelHeight } = rect
      // const distance = Math.sqrt(Math.pow(rect.x - x, 2) + Math.pow(rect.y - y, 2))
      const distance = Math.sqrt(Math.pow(x - panelX, 2) + Math.pow(y - panelY, 2))
      const isOverlapping = isRight
        ? x + this.panelOverlapThreshold * panelWidth > panelX
        : x - this.panelOverlapThreshold * panelWidth < panelX

      /*     if (isOverlapping) {
       return distance < closestPanelRect.distance
       ? { ...rect, distance }
       : closestPanelRect
       }*/

      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort(
      (a, b) => a.distance - b.distance,
    )
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]

    /*    const closestPanelRect = panelRects.reduce(
     (closestPanelRect, panelRect) => {
     const { x: panelX, y: panelY, width: panelWidth, height: panelHeight } = panelRect
     const distance = Math.sqrt(Math.pow(x - panelX, 2) + Math.pow(y - panelY, 2))
     const isOverlapping = isRight
     ? x + this.panelOverlapThreshold * panelWidth > panelX
     : x - this.panelOverlapThreshold * panelWidth < panelX

     if (isOverlapping) {
     return distance < closestPanelRect.distance
     ? { ...panelRect, distance }
     : closestPanelRect
     }

     return closestPanelRect
     },
     { distance: Infinity },
     )*/

    return closestPanelRect.distance === Infinity ? undefined : closestPanelRect
  }
}