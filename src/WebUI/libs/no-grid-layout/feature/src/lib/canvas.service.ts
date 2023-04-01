import { inject, Injectable } from '@angular/core'
import { BlockRectModel } from '@grid-layout/data-access'
import { FreeBlockRectModel } from './free-block-rect.model'
import { PanelStylerService } from './panel-styler.service'
import { LineDirectionEnum } from './line-direction.enum'
import { MousePositionService } from './mouse-position.service'
import { Point } from '@angular/cdk/drag-drop'

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvas!: HTMLCanvasElement
  private ctx!: CanvasRenderingContext2D
  private panelStylerService = inject(PanelStylerService)
  private mousePositionService = inject(MousePositionService)
  // private renderer = inject(Renderer2)
  canvasHasBeenSet = false
  cachedPanels: FreeBlockRectModel[] = []

  get canvasSize() {
    const width = this.canvas.width * this.mousePositionService.scale
    const height = this.canvas.height * this.mousePositionService.scale
    return { width, height }
  }

  setCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas
    this.ctx = ctx
    this.canvasHasBeenSet = true
  }

  drawLineForAboveBlock(
    blockRectModel: FreeBlockRectModel,
  ) {
    const printDefault = () => {
      const moveToPoint: Point = { x: blockRectModel.x, y: blockRectModel.y - blockRectModel.height / 2 }
      // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
      const lineToPoint: Point = { x: blockRectModel.x, y: 0 }
      // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)
      this.strokeTwoPoints(moveToPoint, lineToPoint)

      /*this.ctx.beginPath()
       this.ctx.moveTo(moveToX, moveToY)
       this.ctx.lineTo(lineToX, lineToY)
       this.ctx.stroke()*/

      const distanceToTopOfPage = blockRectModel.y - blockRectModel.height / 2
      const absoluteDistance = Math.abs(distanceToTopOfPage)
      const fillTextX = blockRectModel.x - 50
      const fillTextY = 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      /*      const fillTextPoint: Point = { x: blockRectModel.x - 50, y: 50 }
       const { x: fillTextX, y: fillTextY } = this.mousePositionService.convertPointToGrid(fillTextPoint)
       this.ctx.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)*/
      this.panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Top)
      return
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(
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

    const moveToPoint: Point = { x: blockRectModel.x, y: blockRectModel.y - blockRectModel.height / 2 }
    // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
    const lineToPoint: Point = { x: blockRectModel.x, y: closestPanelRect.y + closestPanelRect.height / 2 }
    // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)
    /*    this.ctx.beginPath()
     this.ctx.moveTo(moveToX, moveToY)
     this.ctx.lineTo(lineToX, lineToY)
     /!*    this.ctx.moveTo(blockRectModel.x, blockRectModel.y - blockRectModel.height / 2)
     this.ctx.lineTo(blockRectModel.x, closestPanelRect.y + closestPanelRect.height / 2)*!/
     this.ctx.stroke()*/

    const distanceToClosestPanel =
      closestPanelRect.y +
      closestPanelRect.height / 2 -
      (blockRectModel.y - blockRectModel.height / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x - 50
    const fillTextY = blockRectModel.y - blockRectModel.height / 2 - 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
    /*    const fillTextPoint: Point = { x: blockRectModel.x - 50, y: blockRectModel.y - blockRectModel.height / 2 - 50 }
     const { x: fillTextX, y: fillTextY } = this.mousePositionService.convertPointToGrid(fillTextPoint)
     this.ctx.fillText(
     `${absoluteDistance}px`,
     fillTextX,
     fillTextY,
     )*/

    this.panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Top)
  }

  drawLineForBelowBlock(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      const moveToPoint: Point = { x: blockRectModel.x, y: blockRectModel.y + blockRectModel.height / 2 }
      // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
      const lineToPoint: Point = { x: blockRectModel.x, y: this.canvasSize.height }
      // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)
      /*     this.ctx.beginPath()
       this.ctx.moveTo(moveToX, moveToY)
       this.ctx.lineTo(lineToX, lineToY)
       /!*      this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
       this.ctx.lineTo(blockRectModel.x, this.canvas.height)*!/
       this.ctx.stroke()*/

      const distanceToBottomOfPage = this.canvasSize.height - (blockRectModel.y + blockRectModel.height / 2)
      const absoluteDistance = Math.abs(distanceToBottomOfPage)
      const fillTextX = blockRectModel.x - 50
      const fillTextY = this.canvasSize.height - 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      // this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, this.canvas.height - 50)
      this.panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Bottom)
      return
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y < rect.y)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.y - blockRectModel.y)

      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    const moveToPoint: Point = { x: blockRectModel.x, y: blockRectModel.y + blockRectModel.height / 2 }
    // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
    const lineToPoint: Point = { x: blockRectModel.x, y: closestPanelRect.y - closestPanelRect.height / 2 }
    // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)
    /*    this.ctx.beginPath()
     this.ctx.moveTo(moveToX, moveToY)
     this.ctx.lineTo(lineToX, lineToY)
     /!*    this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
     this.ctx.lineTo(blockRectModel.x, closestPanelRect.y - closestPanelRect.height / 2)*!/
     this.ctx.stroke()*/

    const distanceToClosestPanel = closestPanelRect.y - closestPanelRect.height / 2 - (blockRectModel.y + blockRectModel.height / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x - 50
    const fillTextY = blockRectModel.y + blockRectModel.height / 2 + 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
    // this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - 50, blockRectModel.y + blockRectModel.height / 2 + 50)
    this.panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Bottom)
  }

  drawLineForLeftBlock(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      const moveToPoint: Point = { x: blockRectModel.x - blockRectModel.width / 2, y: blockRectModel.y }
      // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
      const lineToPoint: Point = { x: 0, y: blockRectModel.y }
      // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)
      /*      this.ctx.beginPath()
       this.ctx.moveTo(moveToX, moveToY)
       this.ctx.lineTo(lineToX, lineToY)
       /!*      this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
       this.ctx.lineTo(0, blockRectModel.y)*!/
       this.ctx.stroke()*/

      const distanceToLeftOfPage = blockRectModel.x - blockRectModel.width / 2
      const absoluteDistance = Math.abs(distanceToLeftOfPage)
      const fillTextX = 50
      const fillTextY = blockRectModel.y - 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      // this.ctx.fillText(`${absoluteDistance}px`, 50, blockRectModel.y - 50)
      this.panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Left)
      return
    }
    if (!this.cachedPanels) {
      return printDefault()
    }
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x > rect.x)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.x - blockRectModel.x)
      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    const moveToPoint: Point = { x: blockRectModel.x - blockRectModel.width / 2, y: blockRectModel.y }
    // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
    const lineToPoint: Point = { x: closestPanelRect.x + closestPanelRect.width / 2, y: blockRectModel.y }
    // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)
    /*    this.ctx.beginPath()
     this.ctx.moveTo(moveToX, moveToY)
     this.ctx.lineTo(lineToX, lineToY)
     /!*    this.ctx.moveTo(blockRectModel.x - blockRectModel.width / 2, blockRectModel.y)
     this.ctx.lineTo(closestPanelRect.x + closestPanelRect.width / 2, blockRectModel.y)*!/
     this.ctx.stroke()*/

    const distanceToClosestPanel = closestPanelRect.x + closestPanelRect.width / 2 - (blockRectModel.x - blockRectModel.width / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x - blockRectModel.width / 2 - 50
    const fillTextY = blockRectModel.y - 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
    // this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x - blockRectModel.width / 2 - 50, blockRectModel.y - 50)

    this.panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Left)

  }

  drawLineForRightBlock(blockRectModel: BlockRectModel) {
    const printDefault = () => {
      // const canvasWidthToScale = this.canvas.width * this.mousePositionService.scale
      const moveToPoint: Point = { x: blockRectModel.x + blockRectModel.width / 2, y: blockRectModel.y }
      // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
      const lineToPoint: Point = { x: this.canvasSize.width, y: blockRectModel.y }
      // const lineToPoint: Point = { x: this.canvas.width, y: blockRectModel.y }
      // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)
      /*     this.ctx.beginPath()
       this.ctx.moveTo(moveToX, moveToY)
       this.ctx.lineTo(lineToX, lineToY)
       /!*      this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
       this.ctx.lineTo(this.canvas.width, blockRectModel.y)*!/
       this.ctx.stroke()*/

      const distanceToRightOfPage = this.canvasSize.width - (blockRectModel.x + blockRectModel.width / 2)
      // const distanceToRightOfPage = this.canvas.width - (blockRectModel.x + blockRectModel.width / 2)
      const absoluteDistance = Math.abs(distanceToRightOfPage)
      const fillTextX = this.canvasSize.width - 50
      const fillTextY = blockRectModel.y - 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      // this.ctx.fillText(`${absoluteDistance}px`, this.canvas.width - 50, blockRectModel.y - 50)
      this.panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Right)
      return
    }
    if (!this.cachedPanels) return printDefault()
    const panelRectsToCheck = this.cachedPanels.filter(rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2 && blockRectModel.x < rect.x)
    if (!panelRectsToCheck.length) return printDefault()

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.x - blockRectModel.x)
      return { ...rect, distance }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    const moveToPoint: Point = { x: blockRectModel.x + blockRectModel.width / 2, y: blockRectModel.y }
    // const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
    const lineToPoint: Point = { x: closestPanelRect.x - closestPanelRect.width / 2, y: blockRectModel.y }
    // const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)
    this.strokeTwoPoints(moveToPoint, lineToPoint)
    /*
     this.ctx.beginPath()
     this.ctx.moveTo(moveToX, moveToY)
     this.ctx.lineTo(lineToX, lineToY)
     /!*    this.ctx.moveTo(blockRectModel.x + blockRectModel.width / 2, blockRectModel.y)
     this.ctx.lineTo(closestPanelRect.x - closestPanelRect.width / 2, blockRectModel.y)*!/
     this.ctx.stroke()*/

    const distanceToClosestPanel = closestPanelRect.x - closestPanelRect.width / 2 - (blockRectModel.x + blockRectModel.width / 2)
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x + blockRectModel.width / 2 + 50
    const fillTextY = blockRectModel.y - 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
    // this.ctx.fillText(`${absoluteDistance}px`, blockRectModel.x + blockRectModel.width / 2 + 50, blockRectModel.y - 50)

    this.panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Right)
  }

  getBlockRect(panelId: string): FreeBlockRectModel | undefined {
    const panels = document.querySelectorAll('[panelId]')

    if (!panels) {
      return undefined
    }

    this.cachedPanels = Array.from(panels).map(panel => this.getBlockRectFromElement(panel))

    const panelDiv = Array.from(panels).find(p => p.getAttribute('panelId') === panelId)

    if (!panelDiv) {
      return undefined
    }
    const panelRect = panelDiv.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2
    return { id: panelId, x, y, height: panelRect.height, width: panelRect.width }
  }

  private getBlockRectFromElement(element: Element): FreeBlockRectModel {
    const panelId = element.getAttribute('panelId')
    if (!panelId) {
      throw new Error('panelId not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return { id: panelId, x, y, height: panelRect.height, width: panelRect.width, element }
  }

  private strokeTwoPoints(moveToPoint: Point, lineToPoint: Point) {
    const { x: moveToX, y: moveToY } = this.mousePositionService.convertPointToGrid(moveToPoint)
    const { x: lineToX, y: lineToY } = this.mousePositionService.convertPointToGrid(lineToPoint)
    this.ctx.beginPath()
    this.ctx.moveTo(moveToX, moveToY)
    this.ctx.lineTo(lineToX, lineToY)
    this.ctx.stroke()
  }

  private fillText(text: string, x: number, y: number) {
    // this.ctx.fillStyle = 'black'
    this.ctx.font = '20px Arial'
    const { x: fillTextX, y: fillTextY } = this.mousePositionService.convertPointToGrid({ x, y })
    this.ctx.fillText(text, fillTextX, fillTextY)
  }
}