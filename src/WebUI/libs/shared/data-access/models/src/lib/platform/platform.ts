export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)
export const isWindows = /^Win/.test(window.navigator.platform)
export const isAndroid = /\b(android)\b/i.test(navigator.userAgent)

export const getCurrentPlatform = (): Platform => {
	if (isDarwin) {
		return PLATFORM.DARWIN
	} else if (isWindows) {
		return PLATFORM.WINDOWS
	} else if (isAndroid) {
		return PLATFORM.ANDROID
	} else {
		return PLATFORM.WINDOWS
	}
}

export const PLATFORM = {
	DARWIN: 'DARWIN',
	WINDOWS: 'WINDOWS',
	ANDROID: 'ANDROID',
} as const

export type Platform = (typeof PLATFORM)[keyof typeof PLATFORM]
