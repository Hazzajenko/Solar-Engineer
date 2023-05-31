export const STRING_COLOR = {
	RED: '#f94144',
	PINK: '#FF99E6', // PINK: '#FF3380',
	ORANGE: '#f3722c',
	YELLOW: '#f8961e',
	GREEN: '#90be6d',
	BLUE: '#277da1',
	PURPLE: '#991AFF',
} as const

export type StringColor = (typeof STRING_COLOR)[keyof typeof STRING_COLOR]

export const stringColors = Object.values(STRING_COLOR)
