import { LineDirection } from '../types'
import { PanelStylerService } from '@design-app/feature-panel'
import { BlockRectModel } from '@grid-layout/data-access'
import { Point } from '@shared/data-access/models'
import {
  DesignRectModel,
  DesignRectModelWithDistance,
  MousePositioningService,
} from 'design-app/utils'


export abstract class BlockRectHelpers {
  protected abstract _panelStylerService: PanelStylerService
  protected abstract _mousePositioningService: MousePositioningService
  protected abstract canvasConfig: any
  protected abstract canvasSize: {
    width: number
    height: number
  }

  protected abstract strokeTwoPoints(moveToPoint: Point, lineToPoint: Point): void

  protected abstract fillText(text: string, x: number, y: number): void

  protected abstract scale: number

  protected getClosestPanelToLine(
    blockRectModel: DesignRectModel,
    gridBlockRects: DesignRectModel[],
    direction: LineDirection,
  ): DesignRectModelWithDistance {
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

  protected getClosestPanelsToLine(
    blockRectModel: DesignRectModel,
    gridBlockRects: DesignRectModel[],
    direction: LineDirection,
  ) {
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
    return panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
  }

  private getPanelRectsToCheckByDirection(
    blockRectModel: DesignRectModel,
    gridBlockRects: DesignRectModel[],
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
    blockRectModel: DesignRectModel,
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
    let moveToPoint: Point = this.getDefaultMoveToPoint(blockRectModel, direction)

    moveToPoint = this._mousePositioningService.getMousePositionFromXYForCanvas(moveToPoint)

    let lineToPoint: Point = this.getDefaultLineToPoint(blockRectModel, direction)
    lineToPoint = this._mousePositioningService.getMousePositionFromXYForCanvas(lineToPoint)

    if (this.canvasConfig.showDirectionLines) {
      this.strokeTwoPoints(moveToPoint, lineToPoint)
    }
    this._panelStylerService.removeFromNearbyPanelsByDirection(direction)

    if (this.canvasConfig.showLineDistance) {
      const distanceToEndOfLine = this.getDistanceToEndOfLine(blockRectModel, direction)
      const absoluteDistance = Math.abs(distanceToEndOfLine)
      const fillTextPosition = this.getFillTextDistancePosition(blockRectModel, direction)
      this.fillText(`${absoluteDistance}px`, fillTextPosition.x, fillTextPosition.y)
    }

    return
  }

  protected getDefaultMoveToPoint(blockRectModel: BlockRectModel, direction: LineDirection): Point {
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

  protected getTopAndBottomGridLinesMoveToPoint(
    blockRectModel: BlockRectModel,
    direction: LineDirection,
  ): {
    moveToPointTop: Point
    moveToPointBottom: Point
  } {
    switch (direction) {
      case LineDirection.Top:
        return {
          moveToPointTop: {
            x: blockRectModel.x - blockRectModel.width / 2,
            y: blockRectModel.y - blockRectModel.height / 2,
          },
          moveToPointBottom: {
            x: blockRectModel.x + blockRectModel.width / 2,
            y: blockRectModel.y - blockRectModel.height / 2,
          },
        }
      case LineDirection.Bottom:
        return {
          moveToPointTop: {
            x: blockRectModel.x - blockRectModel.width / 2,
            y: blockRectModel.y + blockRectModel.height / 2,
          },
          moveToPointBottom: {
            x: blockRectModel.x + blockRectModel.width / 2,
            y: blockRectModel.y + blockRectModel.height / 2,
          },
        }
      case LineDirection.Left:
        return {
          moveToPointTop: {
            x: blockRectModel.x - blockRectModel.width / 2,
            y: blockRectModel.y - blockRectModel.height / 2,
          },
          moveToPointBottom: {
            x: blockRectModel.x - blockRectModel.width / 2,
            y: blockRectModel.y + blockRectModel.height / 2,
          },
        }
      case LineDirection.Right:
        return {
          moveToPointTop: {
            x: blockRectModel.x + blockRectModel.width / 2,
            y: blockRectModel.y - blockRectModel.height / 2,
          },
          moveToPointBottom: {
            x: blockRectModel.x + blockRectModel.width / 2,
            y: blockRectModel.y + blockRectModel.height / 2,
          },
        }

      default:
        throw new Error('invalid direction')
    }
  }

  /*  protected getTopAndBottomGridLinesLineToPoint(
   blockRectModel: BlockRectModel,
   direction: LineDirection,
   ): {
   lineToPointTop: XyLocation
   lineToPointBottom: XyLocation
   }*/
  protected getTopAndBottomGridLinesLineToPoint(
    blockRectModel: BlockRectModel,
    direction: LineDirection,
  ): {
    lineToPointTop: Point
    lineToPointBottom: Point
  } {
    switch (direction) {
      case LineDirection.Top:
        return {
          lineToPointTop: {
            x: blockRectModel.x - blockRectModel.width / 2,
            y: 0,
          },
          lineToPointBottom: {
            x: blockRectModel.x + blockRectModel.width / 2,
            y: 0,
          },
        }
      case LineDirection.Bottom:
        return {
          lineToPointTop: {
            x: blockRectModel.x - blockRectModel.width / 2,
            y: this.canvasSize.height,
          },
          lineToPointBottom: {
            x: blockRectModel.x + blockRectModel.width / 2,
            y: this.canvasSize.height,
          },
        }
      case LineDirection.Left:
        return {
          lineToPointTop: {
            x: 0,
            y: blockRectModel.y - blockRectModel.height / 2,
          },
          lineToPointBottom: {
            x: 0,
            y: blockRectModel.y + blockRectModel.height / 2,
          },
        }
      case LineDirection.Right:
        return {
          lineToPointTop: {
            x: this.canvasSize.width,
            y: blockRectModel.y - blockRectModel.height / 2,
          },
          lineToPointBottom: {
            x: this.canvasSize.width,
            y: blockRectModel.y + blockRectModel.height / 2,
          },
        }

      default:
        throw new Error('invalid direction')
    }
  }

  protected getLineToPointOfClosestPanel(
    blockRectModel: DesignRectModel,
    closestBlockRect: DesignRectModel,
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
    blockRectModel: DesignRectModel,
    closestBlockRect: DesignRectModel,
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

  protected getDefaultLineToPoint(blockRectModel: BlockRectModel, direction: LineDirection): Point {
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
  ): Point {
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