import {
  CanvasEntitiesStore,
  CanvasEntity,
  DIAGONAL_DIRECTION,
  DiagonalDirection,
  TransformedPoint,
} from '@design-app/feature-design-canvas'
import { Point, Size } from '@shared/data-access/models'

export type EntityBounds = {
  left: number
  top: number
  right: number
  bottom: number
  centerX: number
  centerY: number
}

export const getEntityBounds = (entity: CanvasEntity): EntityBounds => {
  return {
    left: entity.location.x,
    top: entity.location.y,
    right: entity.location.x + entity.width,
    bottom: entity.location.y + entity.height,
    centerX: entity.location.x + entity.width / 2,
    centerY: entity.location.y + entity.height / 2,
  }
}

export const getBoundsFromTwoPoints = (point1: Point, point2: Point): EntityBounds => {
  const [left, top, right, bottom] = [
    Math.min(point1.x, point2.x),
    Math.min(point1.y, point2.y),
    Math.max(point1.x, point2.x),
    Math.max(point1.y, point2.y),
  ]

  return {
    left,
    top,
    right,
    bottom,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  }
}

export const isEntityInsideTwoPoints = (entity: CanvasEntity, point1: Point, point2: Point) => {
  const bounds = getEntityBounds(entity)
  const box = getBoundsFromTwoPoints(point1, point2)

  return !(
    box.right < bounds.left ||
    box.left > bounds.right ||
    box.bottom < bounds.top ||
    box.top > bounds.bottom
  )
}

export const checkOverlapBetweenTwoBounds = (
  bounds1: EntityBounds,
  bounds2: EntityBounds,
): boolean => {
  return !(
    bounds2.right < bounds1.left ||
    bounds2.left > bounds1.right ||
    bounds2.bottom < bounds1.top ||
    bounds2.top > bounds1.bottom
  )
}

export const isEntityInsideBounds = (entity: CanvasEntity, bounds: EntityBounds): boolean => {
  const entityBounds = getEntityBounds(entity)
  return (
    entityBounds.left >= bounds.left &&
    entityBounds.top >= bounds.top &&
    entityBounds.right <= bounds.right &&
    entityBounds.bottom <= bounds.bottom
  )
}

export const isEntityOverlappingWithBounds = (
  entity: CanvasEntity,
  bounds: EntityBounds,
): boolean => {
  const entityBounds = getEntityBounds(entity)
  return checkOverlapBetweenTwoBounds(entityBounds, bounds)
}

export const getBoundsFromPoints = (points: Point[]): EntityBounds => {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity

  points.forEach((point) => {
    minX = Math.min(minX, point.x)
    minY = Math.min(minY, point.y)
    maxX = Math.max(maxX, point.x)
    maxY = Math.max(maxY, point.y)
  })

  return {
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
    centerX: (minX + maxX) / 2,
    centerY: (minY + maxY) / 2,
  }
}

export const filterEntitiesInsideBounds = (
  bounds: EntityBounds,
  entities: CanvasEntity[],
): CanvasEntity[] => {
  return entities.filter((entity) => isEntityInsideBounds(entity, bounds))
}

export const filterAllEntityBetweenTwoPoints = (
  point1: TransformedPoint,
  point2: TransformedPoint,
  entity: CanvasEntity,
  direction: DiagonalDirection,
) => {
  const { left, top, right, bottom } = getEntityBounds(entity)

  switch (direction) {
    case DIAGONAL_DIRECTION.BottomLeftToTopRight:
      return (
        point1.x < point2.x &&
        point1.y > point2.y &&
        point1.x < left &&
        point2.x > right &&
        point2.y < top &&
        point1.y > bottom
      )
    case DIAGONAL_DIRECTION.TopLeftToBottomRight:
      return (
        point1.x < point2.x &&
        point1.y < point2.y &&
        point1.x < left &&
        point2.x > right &&
        point1.y < top &&
        point2.y > bottom
      )
    case DIAGONAL_DIRECTION.TopRightToBottomLeft:
      return (
        point1.x > point2.x &&
        point1.y < point2.y &&
        point1.x > left &&
        point2.x < right &&
        point1.y < top &&
        point2.y > bottom
      )
    case DIAGONAL_DIRECTION.BottomRightToTopLeft:
      return (
        point1.x > point2.x &&
        point1.y > point2.y &&
        point1.x > left &&
        point2.x < right &&
        point2.y < top &&
        point1.y > bottom
      )
  }
  return false
}

export const getAllEntitiesBetweenTwoPoints = (
  point1: TransformedPoint,
  point2: TransformedPoint,
  entitiesStore: CanvasEntitiesStore,
  direction: DiagonalDirection,
) => {
  return entitiesStore.select.entities.filter((entity) => {
    const { left, top, right, bottom } = getEntityBounds(entity)

    switch (direction) {
      case DIAGONAL_DIRECTION.BottomLeftToTopRight:
        return (
          point1.x < point2.x &&
          point1.y > point2.y &&
          point1.x < left &&
          point2.x > right &&
          point2.y < top &&
          point1.y > bottom
        )
      case DIAGONAL_DIRECTION.TopLeftToBottomRight:
        return (
          point1.x < point2.x &&
          point1.y < point2.y &&
          point1.x < left &&
          point2.x > right &&
          point1.y < top &&
          point2.y > bottom
        )
      case DIAGONAL_DIRECTION.TopRightToBottomLeft:
        return (
          point1.x > point2.x &&
          point1.y < point2.y &&
          point1.x > left &&
          point2.x < right &&
          point1.y < top &&
          point2.y > bottom
        )
      case DIAGONAL_DIRECTION.BottomRightToTopLeft:
        return (
          point1.x > point2.x &&
          point1.y > point2.y &&
          point1.x > left &&
          point2.x < right &&
          point2.y < top &&
          point1.y > bottom
        )
    }
    return false
  })
}

export const getCommonBoundsFromMultipleEntities = (
  entities: CanvasEntity[],
): EntityBounds | null => {
  if (entities.length === 0) {
    return null
  }

  const bounds = entities.map(getEntityBounds)

  const left = Math.min(...bounds.map((b) => b.left))
  const top = Math.min(...bounds.map((b) => b.top))
  const right = Math.max(...bounds.map((b) => b.right))
  const bottom = Math.max(...bounds.map((b) => b.bottom))

  return {
    left,
    top,
    right,
    bottom,
    centerX: (left + right) / 2,
    centerY: (top + bottom) / 2,
  }
}

export const getTopLeftPointFromBounds = (bounds: EntityBounds): Point => {
  return {
    x: bounds.left,
    y: bounds.top,
  }
}

export const getTopLeftPointFromTransformedPoint = (point: TransformedPoint, size: Size): Point => {
  return {
    x: point.x - size.width / 2,
    y: point.y - size.height / 2,
  }
}

export const getTopLeftPointFromEvent = (event: MouseEvent, size: Size): Point => {
  return {
    x: event.offsetX - size.width / 2,
    y: event.offsetY - size.height / 2,
  }
}