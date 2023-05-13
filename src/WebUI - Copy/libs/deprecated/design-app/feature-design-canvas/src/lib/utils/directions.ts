import { ObjectSize, TransformedPoint } from '../types'

export type SpotInBox = {
	vacant: boolean
	x: number
	y: number
}
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
): DiagonalDirection | undefined {
	if (start.x === end.x || start.y === end.y) {
		return undefined
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

export function getStartingSpotForCreationBox(direction: DiagonalDirection, size: ObjectSize) {
	switch (direction) {
		case DIAGONAL_DIRECTION.TopLeftToBottomRight:
			return {
				x: 0,
				y: 0,
			}
		case DIAGONAL_DIRECTION.TopRightToBottomLeft:
			return {
				x: -size.width,
				y: 0,
			}
		case DIAGONAL_DIRECTION.BottomLeftToTopRight:
			return {
				x: 0,
				y: -size.height,
			}
		case DIAGONAL_DIRECTION.BottomRightToTopLeft:
			return {
				x: -size.width,
				y: -size.height,
			}
	}
}
