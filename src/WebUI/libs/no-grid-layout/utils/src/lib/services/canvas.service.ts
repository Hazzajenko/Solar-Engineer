import { inject, Injectable } from '@angular/core'
import { BlockRectModel } from '@grid-layout/data-access'
import { FreeBlockRectModel, LineDirectionEnum } from '@no-grid-layout/shared'
import { PanelStylerService } from './panel-styler.service'
import { MousePositionService } from './mouse-position.service'
import { ComponentElementsService } from './component-elements.service'
import { XyLocation } from '@shared/data-access/models'

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private _panelStylerService = inject(PanelStylerService)
  private _mousePositionService = inject(MousePositionService)
  private _componentElementService = inject(ComponentElementsService)

  private _canvas: HTMLCanvasElement | undefined
  private _ctx: CanvasRenderingContext2D | undefined

  get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) {
      throw new Error('Canvas context not set')
    }
    return this._ctx
  }

  set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value
  }

  get canvas(): HTMLCanvasElement {
    if (!this._canvas) {
      throw new Error('Canvas not set')
    }
    return this._canvas
  }

  set canvas(value: HTMLCanvasElement) {
    this._canvas = value
  }

  // cachedPanels: FreeBlockRectModel[] = []

  get canvasSize() {
    const scrollRect = this._componentElementService.scrollElement.getBoundingClientRect()

    let width = scrollRect.width
    let height = scrollRect.height
    width = Math.round(width)
    height = Math.round(height)

    return {
      width,
      height,
    }
  }

  /*  setCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
   this.canvas = canvas
   this.ctx = ctx
   }*/

  drawLinesForBlocks(blockRectModel: FreeBlockRectModel) {
    const gridBlockRects = this._componentElementService.elements.map((e) => this.getBlockRectFromElement(e))
    const scrollRect = this._componentElementService.scrollElement.getBoundingClientRect()

    // TODO fix mouseXY when gridElement has been moved

    this.drawLineForAboveBlock(blockRectModel, gridBlockRects, scrollRect.top)
    this.drawLineForBelowBlock(blockRectModel, gridBlockRects, scrollRect.bottom)
    this.drawLineForLeftBlock(blockRectModel, gridBlockRects, scrollRect.left)
    this.drawLineForRightBlock(blockRectModel, gridBlockRects, scrollRect.right)
  }

  drawLineForAboveBlock(
    blockRectModel: FreeBlockRectModel,
    gridBlockRects: FreeBlockRectModel[],
    scrollRectTop: number,
  ) {
    const printDefault = () => {
      let moveToPoint: XyLocation = {
        x: blockRectModel.x,
        y: blockRectModel.y - blockRectModel.height / 2,
      }
      moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      // moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      // const scrollRectTop = this._componentElementService.scrollElement.getBoundingClientRect().top
      let lineToPoint: XyLocation = {
        x: blockRectModel.x,
        y: scrollRectTop,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)
      // lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)
      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToTopOfPage = (blockRectModel.y - blockRectModel.height / 2) - scrollRectTop
      const absoluteDistance = Math.abs(distanceToTopOfPage)
      const fillTextX = blockRectModel.x - 50
      const fillTextY = 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      this._panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Top)
      return
    }
    if (!gridBlockRects) {
      return printDefault()
    }
    const panelRectsToCheck = gridBlockRects.filter(
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
      return {
        ...rect,
        distance,
      }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort(
      (a, b) => a.distance - b.distance,
    )
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    let moveToPoint: XyLocation = {
      x: blockRectModel.x,
      y: blockRectModel.y - blockRectModel.height / 2,
    }
    moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)

    let lineToPoint: XyLocation = {
      x: blockRectModel.x,
      y: closestPanelRect.y + closestPanelRect.height / 2,
    }
    lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)

    const distanceToClosestPanel =
            closestPanelRect.y +
            closestPanelRect.height / 2 -
            (
            blockRectModel.y - blockRectModel.height / 2
            )
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x - 50
    const fillTextY = blockRectModel.y - blockRectModel.height / 2 - 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)

    this._panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Top)
  }

  drawLineForBelowBlock(blockRectModel: BlockRectModel, gridBlockRects: FreeBlockRectModel[], scrollRectBottom: number) {
    const printDefault = () => {
      let moveToPoint: XyLocation = {
        x: blockRectModel.x,
        y: blockRectModel.y + blockRectModel.height / 2,
      }
      moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      // const scrollRectBottom = this._componentElementService.scrollElement.getBoundingClientRect().bottom
      let lineToPoint: XyLocation = {
        x: blockRectModel.x,
        y: scrollRectBottom,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToBottomOfPage = scrollRectBottom - (
        blockRectModel.y + blockRectModel.height / 2
      )
      const absoluteDistance = Math.abs(distanceToBottomOfPage)
      const fillTextX = blockRectModel.x - 50
      const fillTextY = this.canvasSize.height - 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      this._panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Bottom)
      return
    }
    if (!gridBlockRects) {
      return printDefault()
    }
    const panelRectsToCheck = gridBlockRects.filter(
      rect => blockRectModel.x >= rect.x - rect.width / 2
              && blockRectModel.x <= rect.x + rect.width / 2
              && blockRectModel.y < rect.y)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.y - blockRectModel.y)

      return {
        ...rect,
        distance,
      }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    let moveToPoint: XyLocation = {
      x: blockRectModel.x,
      y: blockRectModel.y + blockRectModel.height / 2,
    }
    moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
    let lineToPoint: XyLocation = {
      x: blockRectModel.x,
      y: closestPanelRect.y - closestPanelRect.height / 2,
    }
    lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)

    const distanceToClosestPanel = closestPanelRect.y - closestPanelRect.height / 2 - (
      blockRectModel.y + blockRectModel.height / 2
    )
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x - 50
    const fillTextY = blockRectModel.y + blockRectModel.height / 2 + 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
    this._panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Bottom)

  }

  drawLineForLeftBlock(blockRectModel: BlockRectModel, gridBlockRects: FreeBlockRectModel[], scrollRectLeft: number) {
    const printDefault = () => {
      let moveToPoint: XyLocation = {
        x: blockRectModel.x - blockRectModel.width / 2,
        y: blockRectModel.y,
      }
      moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      const offsetLeft = this._componentElementService.gridLayoutElement.offsetLeft
      let lineToPoint: XyLocation = {
        x: (scrollRectLeft - offsetLeft) * this._mousePositionService.scale,
        y: blockRectModel.y,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToLeftOfPage = (blockRectModel.x - blockRectModel.width / 2) - scrollRectLeft
      const absoluteDistance = Math.abs(distanceToLeftOfPage)
      const fillTextX = 50
      const fillTextY = blockRectModel.y - 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      this._panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Left)
      return
    }
    if (!gridBlockRects) {
      return printDefault()
    }
    const panelRectsToCheck = gridBlockRects.filter(
      rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2
              && blockRectModel.x > rect.x)
    if (!panelRectsToCheck.length) {
      return printDefault()
    }

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.x - blockRectModel.x)
      return {
        ...rect,
        distance,
      }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    let moveToPoint: XyLocation = {
      x: blockRectModel.x - blockRectModel.width / 2,
      y: blockRectModel.y,
    }
    moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
    let lineToPoint: XyLocation = {
      x: closestPanelRect.x + closestPanelRect.width / 2,
      y: blockRectModel.y,
    }
    lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)

    const distanceToClosestPanel = closestPanelRect.x + closestPanelRect.width / 2 - (
                                   blockRectModel.x - blockRectModel.width / 2
    )
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x - blockRectModel.width / 2 - 50
    const fillTextY = blockRectModel.y - 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)

    this._panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Left)

  }

  drawLineForRightBlock(blockRectModel: BlockRectModel, gridBlockRects: FreeBlockRectModel[], scrollRectRight: number) {
    const printDefault = () => {
      let moveToPoint: XyLocation = {
        x: blockRectModel.x + blockRectModel.width / 2,
        y: blockRectModel.y,
      }
      moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      // const scrollRectRight = this._componentElementService.scrollElement.getBoundingClientRect().right
      const offsetLeft = this._componentElementService.gridLayoutElement.offsetLeft
      let lineToPoint: XyLocation = {
        x: scrollRectRight - offsetLeft,
        y: blockRectModel.y,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToRightOfPage = scrollRectRight - (
        blockRectModel.x + blockRectModel.width / 2
      )
      const absoluteDistance = Math.abs(distanceToRightOfPage)
      const fillTextX = this.canvasSize.width - 50
      const fillTextY = blockRectModel.y - 50
      this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)
      this._panelStylerService.removePanelClassForLightUpPanels(LineDirectionEnum.Right)
      return
    }
    if (!gridBlockRects) return printDefault()
    const panelRectsToCheck = gridBlockRects.filter(
      rect => blockRectModel.y >= rect.y - rect.height / 2
              && blockRectModel.y <= rect.y + rect.height / 2
              && blockRectModel.x < rect.x)
    if (!panelRectsToCheck.length) return printDefault()

    const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
      const distance = Math.abs(rect.x - blockRectModel.x)
      return {
        ...rect,
        distance,
      }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
    const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
    if (!closestPanelRect) return printDefault()

    let moveToPoint: XyLocation = {
      x: blockRectModel.x + blockRectModel.width / 2,
      y: blockRectModel.y,
    }
    moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
    let lineToPoint: XyLocation = {
      x: closestPanelRect.x - closestPanelRect.width / 2,
      y: blockRectModel.y,
    }
    lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)
    this.strokeTwoPoints(moveToPoint, lineToPoint)

    const distanceToClosestPanel = closestPanelRect.x - closestPanelRect.width / 2 - (
      blockRectModel.x + blockRectModel.width / 2
    )
    const absoluteDistance = Math.abs(distanceToClosestPanel)
    const fillTextX = blockRectModel.x + blockRectModel.width / 2 + 50
    const fillTextY = blockRectModel.y - 50
    this.fillText(`${absoluteDistance}px`, fillTextX, fillTextY)

    this._panelStylerService.lightUpClosestPanel(closestPanelRect, LineDirectionEnum.Right)
  }

  getBlockRect(panelId: string): FreeBlockRectModel | undefined {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)

    if (!panelDiv) {
      return undefined
    }
    const panelRect = panelDiv.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2
    return {
      id:     panelId,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
    }
  }

  private getBlockRectFromElement(element: Element): FreeBlockRectModel {
    const id = element.getAttribute('id')
    if (!id) {
      throw new Error('id not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return {
      id,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
      element,
    }
  }

  private strokeTwoPoints(moveToPoint: XyLocation, lineToPoint: XyLocation) {
    const {
            x: moveToX,
            y: moveToY,
          } = this._mousePositionService.applyScaleToPoint(moveToPoint)
    const {
            x: lineToX,
            y: lineToY,
          } = this._mousePositionService.applyScaleToPoint(lineToPoint)
    this.ctx.beginPath()
    this.ctx.moveTo(moveToX, moveToY)
    this.ctx.lineTo(lineToX, lineToY)
    this.ctx.stroke()
  }

  private fillText(text: string, x: number, y: number) {
    // this.ctx.fillStyle = 'black'
    this.ctx.font = '20px Arial'
    const {
            x: fillTextX,
            y: fillTextY,
          } = this._mousePositionService.applyScaleToPoint({
      x,
      y,
    })
    this.ctx.fillText(text, fillTextX, fillTextY)
  }
}