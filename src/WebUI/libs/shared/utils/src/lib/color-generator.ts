export const vibrantColors: string[] = [
	'#FF6633',
	'#FFB399',
	'#FF33FF',
	'#FFFF99',
	'#00B3E6',
	'#E6B333',
	'#3366E6',
	'#999966',
	'#99FF99',
	'#B34D4D',
	'#80B300',
	'#809900',
	'#E6B3B3',
	'#6680B3',
	'#66991A',
	'#FF99E6',
	'#CCFF1A',
	'#FF1A66',
	'#E6331A',
	'#33FFCC',
	'#66994D',
	'#B366CC',
	'#4D8000',
	'#B33300',
	'#CC80CC',
	'#66664D',
	'#991AFF',
	'#E666FF',
	'#4DB3FF',
	'#1AB399',
	'#E666B3',
	'#33991A',
	'#CC9999',
	'#B3B31A',
	'#00E680',
	'#4D8066',
	'#809980',
	'#E6FF80',
	'#1AFF33',
	'#999933',
	'#FF3380',
	'#CCCC00',
	'#66E64D',
	'#4D80CC',
	'#9900B3',
	'#E64D66',
	'#4DB380',
	'#FF4D4D',
	'#99E6E6',
	'#6666FF',
	'#FF99CC',
	'#CC80CC',
	'#99CC00',
	'#FFCC99',
	'#3366FF',
	'#CC33FF',
	'#9933FF',
	'#99FFCC',
	'#CCFF00',
	'#FF99FF',
	'#B3B3E6',
	'#FF6633',
	'#FFB399',
	'#FF33FF',
	'#FFFF99',
	'#00B3E6',
	'#E6B333',
	'#3366E6',
	'#999966',
	'#99FF99',
	'#B34D4D',
	'#80B300',
	'#809900',
	'#E6B3B3',
	'#6680B3',
	'#66991A',
	'#FF99E6',
	'#CCFF1A',
	'#FF1A66',
	'#E6331A',
	'#33FFCC',
	'#66994D',
	'#B366CC',
	'#4D8000',
	'#B33300',
	'#CC80CC',
	'#66664D',
	'#991AFF',
	'#E666FF',
	'#4DB3FF',
	'#1AB399',
	'#E666B3',
	'#33991A',
	'#CC9999',
	'#B3B31A',
	'#00E680',
	'#4D8066',
	'#809980',
	'#E6FF80',
	'#1AFF33',
	'#999933',
	'#FF3380',
	'#CCCC00',
	'#66E64D',
	'#4D80CC',
]

/*
 export const stringColors: string[] = [
 '#f94144',
 '#f3722c',
 '#f8961e',
 '#f9844a',
 '#f9c74f',
 '#90be6d',
 '#43aa8b',
 '#4d908e',
 '#577590',
 '#277da1',
 ] as string[]
 */

// export type StringColor = (typeof stringColors)[number]
// export

export const getRandomVibrantColorHex = (): string => {
	return vibrantColors[Math.floor(Math.random() * vibrantColors.length)]
}

const DIGITS = '0123456789ABCDEF' as const

export const getRandomColourBasic = (): string => {
	let result = ''
	for (let i = 0; i < 6; ++i) {
		const index = Math.floor(16 * Math.random())
		result += DIGITS[index]
	}
	return '#' + result
}

export function getRandomColorHex(): string {
	const letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	return color
}

/*
 export function getRandomVibrantColorHex(): string {
 const letters = '456789ABCDEF' // Only include bright/vibrant hex digits
 let color = '#'
 for (let i = 0; i < 6; i++) {
 color += letters[Math.floor(Math.random() * letters.length)]
 }
 return color
 }
 */

export function generateVibrantColorHex(): string {
	const h = Math.random()
	const s = Math.random() * 0.5 + 0.5 // Generate colors with high saturation
	const l = Math.random() * 0.2 + 0.4 // Generate colors with medium-low to low lightness

	// Convert the HSL color to RGB
	const [r, g, b] = hslToRgb(h, s, l)

	// Check if the RGB color is "readable" (i.e. has sufficient contrast) against white
	const textColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'black' : 'white'

	// If the text color is white, the color is not suitable for use on top of a white background,
	// so we generate a new color
	if (textColor === 'white') {
		return generateVibrantColorHex()
	} else {
		return rgbToHex(r, g, b)
	}
}

export function generateDifferentVibrantColorHex(hexColors: string[]): string {
	const [newR, newG, newB] = generateVibrantColor()

	const rbgColors = hexToRgbArray(hexColors)
	// Check if the new color is different from all the colors in the array
	for (const [r, g, b] of rbgColors) {
		// Calculate the Euclidean distance between the two colors in the RGB color space
		const distance = Math.sqrt((newR - r) ** 2 + (newG - g) ** 2 + (newB - b) ** 2)

		// If the distance is less than a certain threshold, generate a new color
		if (distance < 50) {
			// const colors = rgbToHex(r, g, b)
			return generateDifferentVibrantColorHex(hexColors)
		}
	}

	return rgbToHex(newR, newG, newB)
}

export function generateWarmColorHex(): string {
	const h = Math.random() * 0.2 + 0.9 // Generate colors with high hue values (near red)
	const s = Math.random() * 0.5 + 0.5 // Generate colors with high saturation
	const l = Math.random() * 0.5 + 0.5 // Generate colors with high to medium lightness

	// Convert the HSL color to RGB
	const [r, g, b] = hslToRgb(h, s, l)
	return rgbToHex(r, g, b)
}

export function generateWarmColorRgbString(): string {
	const h = Math.random() * 0.2 + 0.9 // Generate colors with high hue values (near red)
	const s = Math.random() * 0.5 + 0.5 // Generate colors with high saturation
	const l = Math.random() * 0.5 + 0.5 // Generate colors with high to medium lightness

	// Convert the HSL color to RGB
	const [r, g, b] = hslToRgb(h, s, l)
	return rbgNumbersToString(r, g, b)
}

export function generateWarmColorRgb(): [number, number, number] {
	const h = Math.random() * 0.2 + 0.9 // Generate colors with high hue values (near red)
	const s = Math.random() * 0.5 + 0.5 // Generate colors with high saturation
	const l = Math.random() * 0.5 + 0.5 // Generate colors with high to medium lightness

	// Convert the HSL color to RGB
	return hslToRgb(h, s, l)
}

export function generateDifferentVibrantColorRgb(hexColors: string[]): [number, number, number] {
	const [newR, newG, newB] = generateVibrantColor()

	const rbgColors = hexToRgbArray(hexColors)
	// Check if the new color is different from all the colors in the array
	for (const [r, g, b] of rbgColors) {
		// Calculate the Euclidean distance between the two colors in the RGB color space
		const distance = Math.sqrt((newR - r) ** 2 + (newG - g) ** 2 + (newB - b) ** 2)

		// If the distance is less than a certain threshold, generate a new color
		if (distance < 50) {
			// const colors = rgbToHex(r, g, b)
			return generateDifferentVibrantColorRgb(hexColors)
		}
	}

	return [newR, newG, newB]
}

export function generateDifferentColor(r: number, g: number, b: number): [number, number, number] {
	const [newR, newG, newB] = generateVibrantColor()

	// Calculate the Euclidean distance between the two colors in the RGB color space
	const distance = Math.sqrt((newR - r) ** 2 + (newG - g) ** 2 + (newB - b) ** 2)

	// If the distance is less than a certain threshold, generate a new color
	if (distance < 50) {
		return generateDifferentColor(r, g, b)
	} else {
		return [newR, newG, newB]
	}
}

export function generateDifferentColor2(
	colors: Array<[number, number, number]>,
): [number, number, number] {
	const [newR, newG, newB] = generateVibrantColor()

	// Check if the new color is different from all the colors in the array
	for (const [r, g, b] of colors) {
		// Calculate the Euclidean distance between the two colors in the RGB color space
		const distance = Math.sqrt((newR - r) ** 2 + (newG - g) ** 2 + (newB - b) ** 2)

		// If the distance is less than a certain threshold, generate a new color
		if (distance < 50) {
			return generateDifferentColor2(colors)
		}
	}

	return [newR, newG, newB]
}

export function generateVibrantColor(): [number, number, number] {
	const h = Math.random()
	const s = Math.random() * 0.5 + 0.5 // Generate colors with high saturation
	const l = Math.random() * 0.2 + 0.4 // Generate colors with medium-low to low lightness

	// Convert the HSL color to RGB
	const [r, g, b] = hslToRgb(h, s, l)

	// Check if the RGB color is "readable" (i.e. has sufficient contrast) against white
	const textColor = r * 0.299 + g * 0.587 + b * 0.114 > 186 ? 'black' : 'white'

	// If the text color is white, the color is not suitable for use on top of a white background,
	// so we generate a new color
	if (textColor === 'white') {
		return generateVibrantColor()
	} else {
		return [r, g, b]
	}
}

export function getLighterOrDarkerColor(color: string, percent: number): string {
	/*	const num = parseInt(color.replace('#', ''), 16)
	 let r = (num >> 16) + percent
	 if (r > 255) r = 255 else if (r < 0) r = 0

	 let b = ((num >> 8) & 0x00FF) + percent
	 if (b > 255) b = 255 else if (b < 0) b = 0

	 let g = (num & 0x0000FF) + percent
	 if (g > 255) g = 255 else if (g < 0) g = 0

	 return '#' + (g | (b << 8) | (r << 16)).toString(16)*/
	return color
}

export function getComplimentaryColors(color: string): string[] {
	const colors: string[] = []

	// Get the RGB values of the color
	const r = parseInt(color.substring(1, 3), 16)
	const g = parseInt(color.substring(3, 5), 16)
	const b = parseInt(color.substring(5, 7), 16)

	// Generate a list of colors that work well with the input color
	colors.push(getLighterOrDarkerColor(color, 20)) // 20% brighter
	colors.push(getLighterOrDarkerColor(color, -20)) // 20% darker
	colors.push(getLighterOrDarkerColor(color, 50)) // 50% brighter
	colors.push(getLighterOrDarkerColor(color, -50)) // 50% darker
	colors.push(getLighterOrDarkerColor(color, 80)) // 80% brighter
	colors.push(getLighterOrDarkerColor(color, -80)) // 80% darker
	colors.push(getLighterOrDarkerColor(color, 100)) // 100% brighter
	colors.push(getLighterOrDarkerColor(color, -100)) // 100% darker

	// Add some complementary colors
	colors.push(getComplementaryColor(r, g, b))
	colors.push(getTriadicColor(r, g, b, 1))
	colors.push(getTriadicColor(r, g, b, 2))
	colors.push(getTetradicColor(r, g, b, 1))
	colors.push(getTetradicColor(r, g, b, 2))
	colors.push(getTetradicColor(r, g, b, 3))

	return colors
}

export function getComplementaryColor(r: number, g: number, b: number): string {
	return (
		'#' +
		(0x1000000 + (255 - r) * 0x10000 + (255 - g) * 0x100 + (255 - b)).toString(16).substring(1)
	)
}

export function getTriadicColor(r: number, g: number, b: number, i: number): string {
	const hsl = rgbToHsl(r, g, b)
	hsl[0] = (hsl[0] + i * 120) % 360
	return hslToRgbString(hsl[0], hsl[1], hsl[2])
}

export function getTetradicColor(r: number, g: number, b: number, i: number): string {
	const hsl = rgbToHsl(r, g, b)
	hsl[0] = (hsl[0] + i * 90) % 360
	return hslToRgbString(hsl[0], hsl[1], hsl[2])
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255
	g /= 255
	b /= 255

	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	let h = 0
	let s = 0
	const l = (max + min) / 2

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}

		h /= 6
	}

	return [h, s, l]
}

export function hslToRgbString(h: number, s: number, l: number): string {
	let r: number
	let g: number
	let b: number

	if (s === 0) {
		r = g = b = l
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	// return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
	return `RGB(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	let r: number
	let g: number
	let b: number

	if (s === 0) {
		r = g = b = l
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1
			if (t > 1) t -= 1
			if (t < 1 / 6) return p + (q - p) * 6 * t
			if (t < 1 / 2) return q
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
			return p
		}

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q
		r = hue2rgb(p, q, h + 1 / 3)
		g = hue2rgb(p, q, h)
		b = hue2rgb(p, q, h - 1 / 3)
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
	// return `RGB(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

export function hexToRgb(hex: string): [number, number, number] {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
	if (!result) return [0, 0, 0]
	return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

export function rgbToHex(r: number, g: number, b: number): string {
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

export function hexToRgbArray(hexArray: string[]): Array<[number, number, number]> {
	return hexArray.map((hex) => hexToRgb(hex))
}

export function rbgNumbersToString(r: number, g: number, b: number) {
	return `RGB(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}
