export const AXIS = {
	X: 'x' as const,
	Y: 'y' as const,
} as const

export type Axis = (typeof AXIS)[keyof typeof AXIS]
export const SAME_AXIS_POSITION = {
	TOP: 'top' as const,
	BOTTOM: 'bottom' as const,
	LEFT: 'left' as const,
	RIGHT: 'right' as const,
} as const

export type SameAxisPosition = (typeof SAME_AXIS_POSITION)[keyof typeof SAME_AXIS_POSITION]
