export const CanvasEvent = {
	Draw: 'draw',
} as const

export type CanvasEvent = (typeof CanvasEvent)[keyof typeof CanvasEvent]
