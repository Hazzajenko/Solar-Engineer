export const SCREEN_SIZE = {
	SMALL: 640,
	MEDIUM: 768,
	LARGE: 1024,
	X_LARGE: 1280,
	XX_LARGE: 1536,
} as const

export type ScreenSize = (typeof SCREEN_SIZE)[keyof typeof SCREEN_SIZE]

export const SCREEN_SIZE_ARRAY = Object.values(SCREEN_SIZE)
