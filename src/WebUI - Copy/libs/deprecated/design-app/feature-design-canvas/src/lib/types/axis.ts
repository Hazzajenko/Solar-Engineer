export const AXIS = {
	X: 'x' as const,
	Y: 'y' as const,
} as const

export type Axis = (typeof AXIS)[keyof typeof AXIS]
// export type Axis = 'x' | 'y'
