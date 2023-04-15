import { inject, Injectable } from '@angular/core'
import { Point } from '@shared/data-access/models'
import { BlockRectHelpers } from './block-rect.helpers'
import { PanelBackgroundColor, PanelStylerService } from '@design-app/feature-panel'
import { ComponentElementsService, DesignRectModel, MousePositioningService, ObjectPositioningService, ViewPositioningService } from 'design-app/utils'
import { SelectedStoreService } from '@design-app/feature-selected'
import { UiConfigService } from '@design-app/config'
import { LineDirection } from '../types'
import { isEntityType } from '@design-app/shared'

@Injectable({
  providedIn: 'root',
})
export class CanvasService
  extends BlockRectHelpers {
  private _componentElementService = inject(ComponentElementsService)
  private _viewPositioningService = inject(ViewPositioningService)
  private _uiConfigService = inject(UiConfigService)
  private _objectPositioningService = inject(ObjectPositioningService)
  // private _selectedFacade = inject(SelectedService)
  private _selectedFacade = inject(SelectedStoreService)
  private _animationId: number | undefined
  protected _panelStylerService = inject(PanelStylerService)
  protected _mousePositioningService = inject(MousePositioningService)
  protected _canvas: HTMLCanvasElement | undefined
  protected _ctx: CanvasRenderingContext2D | undefined

  get canvasConfig() {
    return this._uiConfigService.canvasConfig
  }

  get scale() {
    return this._viewPositioningService.scale
  }

  get ctx(): CanvasRenderingContext2D {
    if (!this._ctx) {
      throw new Error('Canvas context not set')
    }
    return this._ctx
  }

  set ctx(value: CanvasRenderingContext2D) {
    this._ctx = value
    this._ctx.font = this.canvasConfig.font
    this._ctx.fillStyle = this.canvasConfig.fillStyle
    this._ctx.strokeStyle = this.canvasConfig.strokeStyle
    this._ctx.globalAlpha = this.canvasConfig.globalAlpha
    this._ctx.lineWidth = this.canvasConfig.lineWidth
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

  get canvasSize() {
    return {
      width:  this.canvas.width,
      height: this.canvas.height,
    }
  }

  drawLinesForBlocks(id: string) {
    const blockRect = this.getBlockRect(id)
    if (!blockRect) {
      return
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const gridBlockRects = this._componentElementService.elements.map((e) => this.getBlockRectFromElement(e))
    this.drawLineForDirectionV2(blockRect, gridBlockRects, LineDirection.Top)
    this.drawLineForDirectionV2(blockRect, gridBlockRects, LineDirection.Bottom)
    this.drawLineForDirectionV2(blockRect, gridBlockRects, LineDirection.Left)
    this.drawLineForDirectionV2(blockRect, gridBlockRects, LineDirection.Right)
    /*    this.drawLineForDirection(blockRect, gridBlockRects, LineDirection.Bottom)
     this.drawLineForDirection(blockRect, gridBlockRects, LineDirection.Left)
     this.drawLineForDirection(blockRect, gridBlockRects, LineDirection.Right)*/

  }

  drawLineForDirection(
    blockRect: DesignRectModel,
    gridBlockRects: DesignRectModel[],
    lineDirection: LineDirection,
  ) {

    if (!gridBlockRects) {
      return this.printDefault(blockRect, lineDirection)
    }

    const closestPanelRect = this.getClosestPanelToLine(blockRect, gridBlockRects, lineDirection)
    if (!closestPanelRect) {
      return this.printDefault(blockRect, lineDirection)
    }

    let moveToPoint: Point = this.getDefaultMoveToPoint(blockRect, lineDirection)
    moveToPoint = this._mousePositioningService.getMousePositionFromXYForCanvas(moveToPoint)

    let lineToPoint: Point
    if (this.canvasConfig.stopLineAtPanel) {
      lineToPoint = this.getLineToPointOfClosestPanel(blockRect, closestPanelRect, lineDirection)
    } else {
      lineToPoint = this.getDefaultLineToPoint(blockRect, lineDirection)
    }
    lineToPoint = this._mousePositioningService.getMousePositionFromXYForCanvas(lineToPoint)

    if (this.canvasConfig.showDirectionLines) {
      this.strokeTwoPoints(moveToPoint, lineToPoint)
    }

    const distanceToClosestPanel = this.getDistanceToClosestPanel(blockRect, closestPanelRect, lineDirection)

    if ((distanceToClosestPanel / this._viewPositioningService.scale) < 100) {
      this._panelStylerService.setBackgroundColorForPanelById(closestPanelRect.id, PanelBackgroundColor.Nearby, lineDirection)
    } else {
      this._panelStylerService.setBackgroundColorForPanelById(closestPanelRect.id, PanelBackgroundColor.LineThrough, lineDirection)
    }

    if (this.canvasConfig.showLineDistance) {
      const fillTextPoint = this.getFillTextDistancePosition(blockRect, lineDirection)
      this.fillText(`${distanceToClosestPanel}px`, fillTextPoint.x, fillTextPoint.y)
    }
  }

  drawLineForDirectionV2(
    blockRect: DesignRectModel,
    gridBlockRects: DesignRectModel[],
    lineDirection: LineDirection,
  ) {

    if (!gridBlockRects) {
      return this.printDefault(blockRect, lineDirection)
    }

    const closestPanelsRect = this.getClosestPanelsToLine(blockRect, gridBlockRects, lineDirection)
    if (closestPanelsRect.length < 1) {
      return this.printDefault(blockRect, lineDirection)
    }
    if (this.canvasConfig.showDirectionLines) {
      let moveToPoint: Point = this.getDefaultMoveToPoint(blockRect, lineDirection)
      moveToPoint = this._mousePositioningService.getMousePositionFromXYForCanvas(moveToPoint)

      let lineToPoint: Point
      lineToPoint = this.canvasConfig.stopLineAtPanel
        ? this.getLineToPointOfClosestPanel(blockRect, closestPanelsRect[0], lineDirection)
        : this.getDefaultLineToPoint(blockRect, lineDirection)
      lineToPoint = this._mousePositioningService.getMousePositionFromXYForCanvas(lineToPoint)

      this.strokeTwoPoints(moveToPoint, lineToPoint)
    }

    const panelsWithinDistance = closestPanelsRect.filter((panelRect) => {
      return (panelRect.distance / this._viewPositioningService.scale) < 100
    })
    panelsWithinDistance.forEach((panelRect) => {
      if (this.canvasConfig.showGridAxisLines) {
        const gridMoveToPoints = this.getTopAndBottomGridLinesMoveToPoint(blockRect, lineDirection)
        const gridLineToPoints = this.getTopAndBottomGridLinesLineToPoint(blockRect, lineDirection)
        gridMoveToPoints.moveToPointTop =
          this._mousePositioningService.getMousePositionFromXYForCanvas(gridMoveToPoints.moveToPointTop)
        gridMoveToPoints.moveToPointBottom =
          this._mousePositioningService.getMousePositionFromXYForCanvas(gridMoveToPoints.moveToPointBottom)
        gridLineToPoints.lineToPointTop =
          this._mousePositioningService.getMousePositionFromXYForCanvas(gridLineToPoints.lineToPointTop)
        gridLineToPoints.lineToPointBottom =
          this._mousePositioningService.getMousePositionFromXYForCanvas(gridLineToPoints.lineToPointBottom)
        this.strokeTwoPoints(gridMoveToPoints.moveToPointTop, gridLineToPoints.lineToPointTop)
        this.strokeTwoPoints(gridMoveToPoints.moveToPointBottom, gridLineToPoints.lineToPointBottom)
      }
      /*
       const directionNearbySelection = {
       id:        panelRect.id,
       direction: lineDirection,
       }*/

      const nearByEntity = {
        id:   panelRect.id,
        type: panelRect.type,
      }
      // panelRect.type
      // this._selectedFacade.dispatch.addNearbyEntityOnAxis(directionNearbySelection)
      this._objectPositioningService.pushEntityToNearByEntitiesOnAxis(nearByEntity, lineDirection)
      this._panelStylerService.setBackgroundColorForPanelById(panelRect.id, PanelBackgroundColor.Nearby, lineDirection)
    })

    const panelsOutsideDistance = closestPanelsRect.filter((panelRect) => {
      return (panelRect.distance / this._viewPositioningService.scale) >= 100
    })

    panelsOutsideDistance.forEach((panelRect) => {
      this._objectPositioningService.clearNearByEntitiesOnAxis(panelRect.type, lineDirection)
      this._panelStylerService.removeFromNearbyPanelsByDirection(lineDirection)
      if (this.canvasConfig.lightUpClosestPanels) {
        this._panelStylerService.setBackgroundColorForPanelById(panelRect.id, PanelBackgroundColor.LineThrough, lineDirection)
      }
    })

    /*closestPanelsRect.forEach((panelRect) => {
     // panelRect.distance
     const distanceToPanelRect = this.getDistanceToClosestPanel(blockRect, panelRect, lineDirection)

     if ((distanceToPanelRect / this._screenMoveService.scale) < 100) {
     if (this.canvasConfig.showGridAxisLines) {
     const gridMoveToPoints = this.getTopAndBottomGridLinesMoveToPoint(blockRect, lineDirection)
     const gridLineToPoints = this.getTopAndBottomGridLinesLineToPoint(blockRect, lineDirection)
     gridMoveToPoints.moveToPointTop =
     this._mousePositionService.getMousePositionFromXYForCanvas(gridMoveToPoints.moveToPointTop)
     gridMoveToPoints.moveToPointBottom =
     this._mousePositionService.getMousePositionFromXYForCanvas(gridMoveToPoints.moveToPointBottom)
     gridLineToPoints.lineToPointTop =
     this._mousePositionService.getMousePositionFromXYForCanvas(gridLineToPoints.lineToPointTop)
     gridLineToPoints.lineToPointBottom =
     this._mousePositionService.getMousePositionFromXYForCanvas(gridLineToPoints.lineToPointBottom)
     this.strokeTwoPoints(gridMoveToPoints.moveToPointTop, gridLineToPoints.lineToPointTop)
     this.strokeTwoPoints(gridMoveToPoints.moveToPointBottom, gridLineToPoints.lineToPointBottom)
     }

     this._panelStylerService.setBackgroundColorForPanelById(panelRect.id, PanelBackgroundColor.Nearby, lineDirection)
     } else {
     this._panelStylerService.removeFromNearbyPanelsByDirection(lineDirection)
     if (this.canvasConfig.lightUpClosestPanels) {
     this._panelStylerService.setBackgroundColorForPanelById(panelRect.id, PanelBackgroundColor.LineThrough, lineDirection)
     }
     }
     },
     )*/
    if (this.canvasConfig.showLineDistance) {
      const distanceToClosestPanel = this.getDistanceToClosestPanel(blockRect, closestPanelsRect[0], lineDirection)
      const fillTextPoint = this.getFillTextDistancePosition(blockRect, lineDirection)
      this.fillText(`${distanceToClosestPanel}px`, fillTextPoint.x, fillTextPoint.y)
    }
  }

  getBlockRect(panelId: string): DesignRectModel | undefined {
    const panelDiv = this._componentElementService.getComponentElementById(panelId)

    if (!panelDiv) {
      throw new Error('panelDiv not found')
      // return undefined
    }
    const type = panelDiv.getAttribute('type')
    if (!type || !isEntityType(type)) {
      throw new Error('panelDiv has no type')
      // return undefined
    }
    const panelRect = panelDiv.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2
    return {
      id:     panelId,
      type,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
    }
  }

  protected strokeTwoPoints(moveToPoint: Point, lineToPoint: Point) {
    const {
            x: moveToX,
            y: moveToY,
          } = this._mousePositioningService.applyScaleToPoint(moveToPoint)
    const {
            x: lineToX,
            y: lineToY,
          } = this._mousePositioningService.applyScaleToPoint(lineToPoint)
    this.ctx.beginPath()
    this.ctx.moveTo(moveToX, moveToY)
    this.ctx.lineTo(lineToX, lineToY)
    this.ctx.stroke()
    this.ctx.strokeStyle
  }

  protected fillText(text: string, x: number, y: number) {
    // this.ctx.fillStyle = 'black'
    this.ctx.font = '20px Arial'
    const { x: fillTextX, y: fillTextY } = this._mousePositioningService.applyScaleToPoint({ x, y })
    this.ctx.fillText(text, fillTextX, fillTextY)
  }

  private getBlockRectFromElement(element: Element): DesignRectModel {
    const id = element.getAttribute('id')
    if (!id) {
      throw new Error('id not found')
    }
    const type = element.getAttribute('type')
    if (!type || !isEntityType(type)) {
      throw new Error('type not found')
    }
    const panelRect = element.getBoundingClientRect()
    const canvasRect = this.canvas.getBoundingClientRect()
    const x = panelRect.left - canvasRect.left + panelRect.width / 2
    const y = panelRect.top - canvasRect.top + panelRect.height / 2

    return {
      id,
      type,
      x,
      y,
      height: panelRect.height,
      width:  panelRect.width,
    }
  }
}