import { MousePositionService } from '../mouse-position.service'
import { PanelStylerService } from '../panel-styler'
import { BlockRectModel } from '@grid-layout/data-access'
import {
  CanvasConfig,
  FreeBlockRectModel,
  FreeBlockRectModelWithDistance,
  LineDirection,
} from '@no-grid-layout/shared'
import { XyLocation } from '@shared/data-access/models'


export abstract class BlockRectHelpers {
  protected abstract _panelStylerService: PanelStylerService
  protected abstract _mousePositionService: MousePositionService
  protected abstract canvasConfig: CanvasConfig
  protected abstract canvasSize: {
    width: number
    height: number
  }

  protected abstract strokeTwoPoints(moveToPoint: XyLocation, lineToPoint: XyLocation): void

  protected abstract fillText(text: string, x: number, y: number): void

  protected getClosestPanelToLine(
    blockRectModel: FreeBlockRectModel,
    gridBlockRects: FreeBlockRectModel[],
    direction: LineDirection,
  ): FreeBlockRectModelWithDistance {
    const panelRectsToCheck = this.getPanelRectsToCheckByDirection(
      blockRectModel,
      gridBlockRects,
      direction,
    )
    const panelRectsToCheckWithDistance = panelRectsToCheck.map((rect) => {
      const distance = this.getDistance(blockRectModel, rect, direction)
      return {
        ...rect,
        distance,
      }
    })
    const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort(
      (a, b) => a.distance - b.distance,
    )
    return panelRectsToCheckWithDistanceSorted[0]
  }

  private getClosedPanelToTopLine(
    blockRectModel: FreeBlockRectModel,
    gridBlockRects: BlockRectModel[],
  ) {
    const panelRectsToCheck = gridBlockRects.filter(
      (rect) =>
        blockRectModel.x >= rect.x - rect.width / 2 &&
        blockRectModel.x <= rect.x + rect.width / 2 &&
        blockRectModel.y > rect.y,
    )
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
    return panelRectsToCheckWithDistanceSorted[0]
  }

  private getPanelRectsToCheckByDirection(
    blockRectModel: FreeBlockRectModel,
    gridBlockRects: FreeBlockRectModel[],
    direction: LineDirection,
  ) {
    switch (direction) {
      case LineDirection.Top:
        return gridBlockRects.filter(
          (rect) =>
            blockRectModel.x >= rect.x - rect.width / 2 &&
            blockRectModel.x <= rect.x + rect.width / 2 &&
            blockRectModel.y > rect.y,
        )
      case LineDirection.Bottom: {
        return gridBlockRects.filter(
          (rect) =>
            blockRectModel.x >= rect.x - rect.width / 2 &&
            blockRectModel.x <= rect.x + rect.width / 2 &&
            blockRectModel.y < rect.y,
        )
      }
      case LineDirection.Left: {
        return gridBlockRects.filter(
          (rect) =>
            blockRectModel.y >= rect.y - rect.height / 2 &&
            blockRectModel.y <= rect.y + rect.height / 2 &&
            blockRectModel.x > rect.x,
        )
      }
      case LineDirection.Right: {
        return gridBlockRects.filter(
          (rect) =>
            blockRectModel.y >= rect.y - rect.height / 2 &&
            blockRectModel.y <= rect.y + rect.height / 2 &&
            blockRectModel.x < rect.x,
        )
      }
      default:
        throw new Error('Invalid direction')
    }
  }

  private getDistance(
    blockRectModel: FreeBlockRectModel,
    rect: BlockRectModel,
    direction: LineDirection,
  ) {
    switch (direction) {
      case LineDirection.Top:
      case LineDirection.Bottom:
        return Math.abs(rect.y - blockRectModel.y)
      case LineDirection.Left:
      case LineDirection.Right:
        return Math.abs(rect.x - blockRectModel.x)
      default:
        throw new Error('Invalid direction')
    }
  }

  protected printDefault(blockRectModel: BlockRectModel, direction: LineDirection) {
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
    const fillTextPosition = this.getFillTextDistancePosition(blockRectModel, direction)
    this.fillText(`${absoluteDistance}px`, fillTextPosition.x, fillTextPosition.y)

    return
  }

  protected getDefaultMoveToPoint(
    blockRectModel: BlockRectModel,
    direction: LineDirection,
  ): XyLocation {
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

  protected getLineToPointOfClosestPanel(
    blockRectModel: FreeBlockRectModel,
    closestBlockRect: FreeBlockRectModel,
    direction: LineDirection,
  ) {
    switch (direction) {
      case LineDirection.Top:
        return {
          x: blockRectModel.x,
          y: closestBlockRect.y + closestBlockRect.height / 2,
        }
      case LineDirection.Bottom:
        return {
          x: blockRectModel.x,
          y: closestBlockRect.y - closestBlockRect.height / 2,
        }
      case LineDirection.Left:
        return {
          x: closestBlockRect.x + closestBlockRect.width / 2,
          y: blockRectModel.y,
        }
      case LineDirection.Right:
        return {
          x: closestBlockRect.x - closestBlockRect.width / 2,
          y: blockRectModel.y,
        }

      default:
        throw new Error('Invalid direction')
    }
  }

  protected getDistanceToClosestPanel(
    blockRectModel: FreeBlockRectModel,
    closestBlockRect: FreeBlockRectModel,
    direction: LineDirection,
  ) {
    switch (direction) {
      case LineDirection.Top:
      case LineDirection.Bottom:
        return Math.abs(closestBlockRect.y - blockRectModel.y)
      case LineDirection.Left:
      case LineDirection.Right:
        return Math.abs(closestBlockRect.x - blockRectModel.x)
      default:
        throw new Error('Invalid direction')
    }
  }

  private getDefaultLineToPoint(
    blockRectModel: BlockRectModel,
    direction: LineDirection,
  ): XyLocation {
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

  protected getFillTextDistancePosition(
    blockRectModel: BlockRectModel,
    direction: LineDirection,
  ): XyLocation {
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
  }
}