export const LineDirection = {
	Top: 'top',
	Bottom: 'bottom',
	Left: 'left',
	Right: 'right',
} as const

export type LineDirection = (typeof LineDirection)[keyof typeof LineDirection]

// const arr = [0, 1, 2]
// arr.arrayChain((x) => x * 2)
