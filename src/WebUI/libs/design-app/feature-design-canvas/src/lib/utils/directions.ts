import { TransformedPoint } from '../types'

export const DIAGONAL_DIRECTION = {
  BottomLeftToTopRight: 'BottomLeftToTopRight',
  BottomRightToTopLeft: 'BottomRightToTopLeft',
  TopLeftToBottomRight: 'TopLeftToBottomRight',
  TopRightToBottomLeft: 'TopRightToBottomLeft',
} as const

export type DiagonalDirection = (typeof DIAGONAL_DIRECTION)[keyof typeof DIAGONAL_DIRECTION]

export function getDiagonalDirectionFromTwoPoints(
  start: TransformedPoint,
  end: TransformedPoint,
): DiagonalDirection | null {
  if (start.x === end.x || start.y === end.y) {
    return null
  }
  switch (true) {
    case start.x < end.x && start.y > end.y:
      return DIAGONAL_DIRECTION.BottomLeftToTopRight
    case start.x < end.x && start.y < end.y:
      return DIAGONAL_DIRECTION.TopLeftToBottomRight
    case start.x > end.x && start.y < end.y:
      return DIAGONAL_DIRECTION.TopRightToBottomLeft
    case start.x > end.x && start.y > end.y:
      return DIAGONAL_DIRECTION.BottomRightToTopLeft
    default: {
      console.error('Invalid direction', start, end)
      throw new Error('Invalid direction')
    }
  }
}