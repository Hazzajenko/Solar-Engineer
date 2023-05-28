import { SCREEN_SIZE } from '@shared/data-access/models'

export const getScreenSize = () => {
	if (window.innerWidth < SCREEN_SIZE.MEDIUM) return SCREEN_SIZE.SMALL
	if (window.innerWidth >= SCREEN_SIZE.MEDIUM && window.innerWidth < SCREEN_SIZE.LARGE)
		return SCREEN_SIZE.MEDIUM
	if (window.innerWidth >= SCREEN_SIZE.LARGE && window.innerWidth < SCREEN_SIZE.X_LARGE)
		return SCREEN_SIZE.LARGE
	if (window.innerWidth >= SCREEN_SIZE.X_LARGE && window.innerWidth < SCREEN_SIZE.XX_LARGE)
		return SCREEN_SIZE.X_LARGE
	if (window.innerWidth >= SCREEN_SIZE.XX_LARGE) return SCREEN_SIZE.XX_LARGE
	throw new Error('Screen size not found')
}
export const isMobile = () => {
	return window.innerWidth < SCREEN_SIZE.MEDIUM
}

export const isTablet = () => {
	return window.innerWidth >= SCREEN_SIZE.MEDIUM && window.innerWidth < SCREEN_SIZE.LARGE
}

export const isDesktop = () => {
	return window.innerWidth >= SCREEN_SIZE.LARGE
}

export const isXLarge = () => {
	return window.innerWidth >= SCREEN_SIZE.X_LARGE
}
