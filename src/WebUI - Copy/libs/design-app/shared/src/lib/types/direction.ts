export const DIAGONAL_DIRECTION = {
	BottomLeftToTopRight: 'BottomLeftToTopRight',
	BottomRightToTopLeft: 'BottomRightToTopLeft',
	TopLeftToBottomRight: 'TopLeftToBottomRight',
	TopRightToBottomLeft: 'TopRightToBottomLeft',
} as const

export type DiagonalDirection = (typeof DIAGONAL_DIRECTION)[keyof typeof DIAGONAL_DIRECTION]
