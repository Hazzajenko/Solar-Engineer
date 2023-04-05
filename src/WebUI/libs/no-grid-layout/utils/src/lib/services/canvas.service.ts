import { inject, Injectable } from '@angular/core'
import { BlockRectModel } from '@grid-layout/data-access'
import { FreeBlockRectModel, LineDirectionEnum } from '@no-grid-layout/shared'
import { PanelStylerService } from './panel-styler.service'
import { MousePositionService } from './mouse-position.service'
import { ComponentElementsService } from './component-elements.service'
import { XyLocation } from '@shared/data-access/models'
import { ScreenMoveService } from './screen-move.service'

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private _panelStylerService = inject(PanelStylerService)
  private _mousePositionService = inject(MousePositionService)
  private _componentElementService = inject(ComponentElementsService)
  private _screenMoveService = inject(ScreenMoveService)
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
    /*    console.log('scrollRect', scrollRect)
     console.log('scrollTop', scrollRect.top)
     console.log('scrollOffsetTop', this._componentElementService.scrollElement.offsetTop)
     const gridRect = this._componentElementService.gridLayoutElement.getBoundingClientRect()
     console.log('gridTop', gridRect.top)
     console.log('gridOffsetTop', this._componentElementService.gridLayoutElement.offsetTop)
     const canvasRect = this.canvas.getBoundingClientRect()
     console.log('canvasTop', canvasRect.top)
     console.log('canvasOffsetTop', this.canvas.offsetTop)*/
    // console.log()

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
      // const canvasRect = this.canvas.getBoundingClientRect()
      // console.log('canvasTop', canvasRect.top)
      // console.log('canvasLeft', canvasRect.left)

      // console.log('canvasOffsetTop', this.canvas.offsetTop)
      // // const canvasOffsetTop = this.canvas.offsetTop
      // const canvasOffsetLeft = this.canvas.offsetLeft

      let moveToPoint: XyLocation = {
        x: blockRectModel.x,
        y: blockRectModel.y - blockRectModel.height / 2,
      }
      /*      moveToPoint = {
       x: moveToPoint.x - canvasRect.left,
       y: moveToPoint.y - canvasRect.top,
       }*/
      moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      // moveToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(moveToPoint)
      // const scrollRectTop = this._componentElementService.scrollElement.getBoundingClientRect().top
      // const scrollOffsetTop = this._componentElementService.scrollElement.offsetTop
      /*      var offset = $div.offset();
       var zoomFactor = $div.parent().width() / $(window).width(); // Assuming the parent container is the full width of the window
       var left = offset.left * zoomFactor;
       var top = offset.top * zoomFactor;*/
      /*      const offset = this._componentElementService.scrollElement.getBoundingClientRect()
       const zoomFactor = offset.width / window.innerWidth
       const left = offset.left * zoomFactor
       const top = offset.top * zoomFactor
       console.log('offset', offset)
       console.log('zoomFactor', zoomFactor)
       console.log('left', left)
       console.log('top', top)*/
      /*      let lineToPoint: XyLocation = {
       x: blockRectModel.x,
       y: 0,
       }*/

      // const zoomFactor = this._componentElementService.scrollElement.parentElement.clientWidth / window.innerWidth
      let lineToPoint: XyLocation = {
        x: blockRectModel.x,
        // y: top,
        // y: 0 - this._componentElementService.gridLayoutElement.offsetTop,
        y: 0,
        // y: (scrollRectTop),
        // y: (scrollRectTop),
      }
      /*      lineToPoint = {
       x: lineToPoint.x - canvasRect.left,
       y: lineToPoint.y - canvasRect.top,
       }*/
      // lineToPoint.x = lineToPoint.x * this._screenMoveService.scale
      // lineToPoint.y = lineToPoint.y * this._screenMoveService.scale
      /*      lineToPoint = {
       x: lineToPoint.x * this._screenMoveService.scale,
       // y: lineToPoint.y - (this._componentElementService.gridLayoutElement.offsetTop * this._screenMoveService.scale),
       y: (this._componentElementService.gridLayoutElement.offsetTop - lineToPoint.y)
       // y: (lineToPoint.y - this._componentElementService.gridLayoutElement.offsetTop)
       * this._screenMoveService.scale,
       }*/
      // const mathString = `lineToPoint.y [${lineToPoint.y}] = scrollRectTop:${scrollRectTop} - gridOffsetTop:${this._componentElementService.gridLayoutElement.offsetTop} * scale:${this._screenMoveService.scale}`
      // console.log(mathString)
      /*
       lineToPoint = {
       x: lineToPoint.x,
       y: Math.abs(lineToPoint.y),
       }*/
      // const x = (xy.x - this._gridLayoutElement.offsetLeft + rect.left) * this.scale
      // const y = (xy.y - this._gridLayoutElement.offsetTop + rect.top) * this.scale
      // console.log('offSetTop', this._componentElementService.gridLayoutElement.offsetTop)
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)
      // lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)
      this.strokeTwoPoints(moveToPoint, lineToPoint)
      // console.log(lineToPoint)

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
        y: window.innerHeight,
        // y: this.canvasSize.height,
        // y: scrollRectBottom - this._componentElementService.gridLayoutElement.offsetTop,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToBottomOfPage = scrollRectBottom - (
        blockRectModel.y + blockRectModel.height / 2
      )
      const absoluteDistance = Math.abs(distanceToBottomOfPage)
      const fillTextX = blockRectModel.x - 50
      const fillTextY = window.innerHeight - 50
      // const fillTextY = this.canvasSize.height - 50
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
      // const offsetLeft = this._componentElementService.gridLayoutElement.offsetLeft
      let lineToPoint: XyLocation = {
        x: 0,
        // x: (scrollRectLeft - offsetLeft) * this._mousePositionService.scale,
        y: blockRectModel.y,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToLeftOfPage = (blockRectModel.x - blockRectModel.width / 2)
      // const distanceToLeftOfPage = (blockRectModel.x - blockRectModel.width / 2) - scrollRectLeft
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
      // const offsetLeft = this._componentElementService.gridLayoutElement.offsetLeft
      let lineToPoint: XyLocation = {
        x: window.innerWidth,
        // x: this.canvasSize.width,
        // x: scrollRectRight - offsetLeft,
        y: blockRectModel.y,
      }
      lineToPoint = this._mousePositionService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)

      const distanceToRightOfPage = scrollRectRight - (
        blockRectModel.x + blockRectModel.width / 2
      )
      const absoluteDistance = Math.abs(distanceToRightOfPage)
      const fillTextX = window.innerWidth - 50
      // const fillTextX = this.canvasSize.width - 50
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