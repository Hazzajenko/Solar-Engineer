import { inject, Injectable } from '@angular/core'
import { BlockRectModel } from '@grid-layout/data-access'
import { FreeBlockRectModel, LineDirection, LineDirectionEnum } from '@no-grid-layout/shared'
import { PanelBackgroundColor, PanelStylerService } from '../panel-styler'
import { MousePositionService } from '../mouse-position.service'
import { ComponentElementsService } from '../component-elements.service'
import { XyLocation } from '@shared/data-access/models'
import { ScreenMoveService } from '../screen-move.service'
import { UiConfigService } from '@no-grid-layout/data-access'
import { BlockRectHelpers } from './block-rect.helpers'

@Injectable({
  providedIn: 'root',
})
export class CanvasService
  extends BlockRectHelpers {
  protected _panelStylerService = inject(PanelStylerService)
  protected _mousePositionService = inject(MousePositionService)
  private _componentElementService = inject(ComponentElementsService)
  private _screenMoveService = inject(ScreenMoveService)
  protected _canvas: HTMLCanvasElement | undefined
  protected _ctx: CanvasRenderingContext2D | undefined
  private _uiConfigService = inject(UiConfigService)

  get canvasConfig() {
    return this._uiConfigService.canvasConfig
  }

  get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) {
      throw new Error('Canvas context not set')
    }
    return this._ctx
  }

  set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value
    this._ctx.font = this._uiConfigService.canvasConfig.font
    this._ctx.fillStyle = this._uiConfigService.canvasConfig.fillStyle
    this._ctx.strokeStyle = this._uiConfigService.canvasConfig.strokeStyle
    this._ctx.globalAlpha = this._uiConfigService.canvasConfig.globalAlpha
    this._ctx.lineWidth = this._uiConfigService.canvasConfig.lineWidth
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
    return {
      width:  this.canvas.width,
      height: this.canvas.height,
    }
  }

  drawLinesForBlocks(blockRectModel: FreeBlockRectModel) {
    const gridBlockRects = this._componentElementService.elements.map((e) => this.getBlockRectFromElement(e))

    this.drawLineForDirection(blockRectModel, gridBlockRects, LineDirection.Top)
    this.drawLineForDirection(blockRectModel, gridBlockRects, LineDirection.Bottom)
    this.drawLineForDirection(blockRectModel, gridBlockRects, LineDirection.Left)
    this.drawLineForDirection(blockRectModel, gridBlockRects, LineDirection.Right)
    // this.drawLineForAboveBlock(blockRectModel, gridBlockRects)
    // this.drawLineForBelowBlock(blockRectModel, gridBlockRects)
    // this.drawLineForLeftBlock(blockRectModel, gridBlockRects)
    // this.drawLineForRightBlock(blockRectModel, gridBlockRects)
  }

  drawLineForDirection(
    blockRectModel: FreeBlockRectModel,
    gridBlockRects: FreeBlockRectModel[],
    lineDirection: LineDirection,
  ) {

    if (!gridBlockRects) {
      return this.printDefault(blockRectModel, lineDirection)
    }

    const closestPanelRect = this.getClosestPanelToLine(blockRectModel, gridBlockRects, lineDirection)
    if (!closestPanelRect) {
      return this.printDefault(blockRectModel, lineDirection)
    }

    let moveToPoint: XyLocation = this.getDefaultMoveToPoint(blockRectModel, lineDirection)
    moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)

    let lineToPoint: XyLocation = this.getLineToPointOfClosestPanel(blockRectModel, closestPanelRect, lineDirection)
    lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)

    const distanceToClosestPanel = this.getDistanceToClosestPanel(blockRectModel, closestPanelRect, lineDirection)

    if ((distanceToClosestPanel / this._screenMoveService.scale) < 100) {
      this._panelStylerService.setBackgroundColorForPanelById(closestPanelRect.id, PanelBackgroundColor.Nearby, lineDirection)
    } else {
      this._panelStylerService.setBackgroundColorForPanelById(closestPanelRect.id, PanelBackgroundColor.LineThrough, lineDirection)
    }

    if (!this.canvasConfig.showLineDistance) {
      return
    }

    const fillTextPoint = this.getFillTextDistancePosition(blockRectModel, lineDirection)
    this.fillText(`${distanceToClosestPanel}px`, fillTextPoint.x, fillTextPoint.y)
  }

  drawLineForAboveBlock(
    blockRectModel: FreeBlockRectModel,
    gridBlockRects: FreeBlockRectModel[],
  ) {

    if (!gridBlockRects) {
      return this.printDefault(blockRectModel, LineDirection.Top)
    }

    const closestPanelRect = this.getClosestPanelToLine(blockRectModel, gridBlockRects, LineDirection.Top)
    if (!closestPanelRect) {
      return this.printDefault(blockRectModel, LineDirection.Top)
    }

    let moveToPoint: XyLocation = this.getDefaultMoveToPoint(blockRectModel, LineDirection.Top)
    moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)

    let lineToPoint: XyLocation = this.getLineToPointOfClosestPanel(blockRectModel, closestPanelRect, LineDirection.Top)
    lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

    this.strokeTwoPoints(moveToPoint, lineToPoint)

    const distanceToClosestPanel = this.getDistanceToClosestPanel(blockRectModel, closestPanelRect, LineDirection.Top)

    if ((distanceToClosestPanel / this._screenMoveService.scale) < 100) {
      this._panelStylerService.setBackgroundColorForPanelById(closestPanelRect.id, PanelBackgroundColor.Nearby, LineDirection.Top)
    } else {
      this._panelStylerService.setBackgroundColorForPanelById(closestPanelRect.id, PanelBackgroundColor.LineThrough, LineDirection.Top)
    }

    if (!this.canvasConfig.showLineDistance) {
      return
    }

    const fillTextX = blockRectModel.x - 50
    const fillTextY = blockRectModel.y - blockRectModel.height / 2 - 50
    this.fillText(`${distanceToClosestPanel}px`, fillTextX, fillTextY)
  }

  drawLineForBelowBlock(blockRectModel: BlockRectModel, gridBlockRects: FreeBlockRectModel[]) {
    if (!gridBlockRects) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Bottom)
    }
    const panelRectsToCheck = gridBlockRects.filter(
      rect => blockRectModel.x >= rect.x - rect.width / 2
              && blockRectModel.x <= rect.x + rect.width / 2
              && blockRectModel.y < rect.y)
    if (!panelRectsToCheck.length) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Bottom)
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
    if (!closestPanelRect) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Bottom)
    }

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

  drawLineForLeftBlock(blockRectModel: BlockRectModel, gridBlockRects: FreeBlockRectModel[]) {

    if (!gridBlockRects) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Left)
    }
    const panelRectsToCheck = gridBlockRects.filter(
      rect => blockRectModel.y >= rect.y - rect.height / 2 && blockRectModel.y <= rect.y + rect.height / 2
              && blockRectModel.x > rect.x)
    if (!panelRectsToCheck.length) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Left)
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
    if (!closestPanelRect) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Left)
    }

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

  drawLineForRightBlock(blockRectModel: BlockRectModel, gridBlockRects: FreeBlockRectModel[]) {

    if (!gridBlockRects) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Right)
    }
    const panelRectsToCheck = gridBlockRects.filter(
      rect => blockRectModel.y >= rect.y - rect.height / 2
              && blockRectModel.y <= rect.y + rect.height / 2
              && blockRectModel.x < rect.x)
    if (!panelRectsToCheck.length) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Right)
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
    if (!closestPanelRect) {
      // return printDefault()
      return this.printDefault(blockRectModel, LineDirection.Right)
    }

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

  /*

   private printDefault(blockRectModel: BlockRectModel, direction: LineDirection) {
   let moveToPoint: XyLocation = this.getDefaultMoveToPoint(blockRectModel, direction)

   moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)

   let lineToPoint: XyLocation = this.getDefaultLineToPoint(blockRectModel, direction)
   lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

   this.strokeTwoPoints(moveToPoint, lineToPoint)
   this._panelStylerService.removeFromNearbyPanelsByDirection(direction)
   if (!this.canvasConfig.showLineDistance) {
   return
   }

   const distanceToEndOfLine = this.getDistanceToEndOfLine(blockRectModel, direction)
   const absoluteDistance = Math.abs(distanceToEndOfLine)
   /!*    const fillTextX = blockRectModel.x - 50
   const fillTextY = 50*!/
   const fillTextPosition = this.getFillTextDistancePosition(blockRectModel, direction)
   this.fillText(`${absoluteDistance}px`, fillTextPosition.x, fillTextPosition.y)

   return
   }
   */

  /*private getDefaultMoveToPoint(blockRectModel: BlockRectModel, direction: LineDirection): XyLocation {
   switch (direction) {
   case LineDirection.Top:
   return {
   x: blockRectModel.x,
   y: blockRectModel.y - blockRectModel.height / 2,
   }
   case LineDirection.Bottom:
   return {
   x: blockRectModel.x,
   y: blockRectModel.y + blockRectModel.height / 2,
   }
   case LineDirection.Left:
   return {
   x: blockRectModel.x - blockRectModel.width / 2,
   y: blockRectModel.y,
   }
   case LineDirection.Right:
   return {
   x: blockRectModel.x + blockRectModel.width / 2,
   y: blockRectModel.y,
   }
   default:
   throw new Error('invalid direction')
   }
   }

   private getDefaultLineToPoint(blockRectModel: BlockRectModel, direction: LineDirection): XyLocation {
   switch (direction) {
   case LineDirection.Top:
   return {
   x: blockRectModel.x,
   y: 0,
   }
   case LineDirection.Bottom:
   return {
   x: blockRectModel.x,
   y: this.canvasSize.height,
   }
   case LineDirection.Left:
   return {
   x: 0,
   y: blockRectModel.y,
   }
   case LineDirection.Right:
   return {
   x: this.canvasSize.width,
   y: blockRectModel.y,
   }
   default:
   throw new Error('invalid direction')
   }
   }

   private getDistanceToEndOfLine(blockRectModel: BlockRectModel, direction: LineDirection): number {
   switch (direction) {
   case LineDirection.Top:
   return blockRectModel.y - blockRectModel.height / 2
   case LineDirection.Bottom:
   return this.canvasSize.height - (blockRectModel.y + blockRectModel.height / 2)
   case LineDirection.Left:
   return blockRectModel.x - blockRectModel.width / 2
   case LineDirection.Right:
   return this.canvasSize.width - (blockRectModel.x + blockRectModel.width / 2)
   default:
   throw new Error('invalid direction')
   }
   }

   private getFillTextDistancePosition(blockRectModel: BlockRectModel, direction: LineDirection): XyLocation {
   switch (direction) {
   case LineDirection.Top:
   return {
   x: blockRectModel.x - 50,
   y: 50,
   }
   case LineDirection.Bottom:
   return {
   x: blockRectModel.x - 50,
   y: this.canvasSize.height - 50,
   }
   case LineDirection.Left:
   return {
   x: 50,
   y: blockRectModel.y - 50,
   }
   case LineDirection.Right:
   return {
   x: this.canvasSize.width - 50,
   y: blockRectModel.y - 50,
   }
   default:
   throw new Error('invalid direction')
   }
   }*/

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
      // element,
    }
  }

  protected strokeTwoPoints(moveToPoint: XyLocation, lineToPoint: XyLocation) {
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
    this.ctx.strokeStyle
  }

  protected fillText(text: string, x: number, y: number) {
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