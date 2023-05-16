import { CursorSvgPinkSource, CursorSvgSource } from './cursor.svg'
import { GrabSvgSource } from './grab.svg'
import { GrabbingSvgSource } from './grabbing.svg'
import { MoveSvgSource } from './move.svg'

const svgSources = [CursorSvgSource, GrabSvgSource, GrabbingSvgSource, MoveSvgSource] as const

const svgSourcesRecord = {
	cursor: CursorSvgSource,
	grab: GrabSvgSource,
	grabbing: GrabbingSvgSource,
	move: MoveSvgSource,
} as const

export const svgSourcesRecordKeys = Object.keys(
	svgSourcesRecord,
) as (keyof typeof svgSourcesRecord)[]
export const svgSourcesRecordValues = Object.values(
	svgSourcesRecord,
) as (typeof svgSourcesRecord)[keyof typeof svgSourcesRecord][]

export const svgSourcesRecordEntries = Object.entries(svgSourcesRecord) as [
	keyof typeof svgSourcesRecord,
	(typeof svgSourcesRecord)[keyof typeof svgSourcesRecord],
][]

export type SvgSourcesRecordKey = keyof typeof svgSourcesRecord

export type SvgSourceRecord = {
	[key in SvgCursorKey]: (typeof svgSourcesRecord)[key]
}

export const SVG_CURSOR_KEY = {
	CURSOR: 'cursor',
	GRAB: 'grab',
	GRABBING: 'grabbing',
	MOVE: 'move',
} as const

export type SvgCursorKey = (typeof SVG_CURSOR_KEY)[keyof typeof SVG_CURSOR_KEY]

export const SVG_CURSOR_SOURCE = {
	[SVG_CURSOR_KEY.CURSOR]: CursorSvgPinkSource, // [SVG_CURSOR_KEY.CURSOR]: CursorSvgSource,
	// [SVG_CURSOR_KEY.CURSOR]: CursorSvgV2Source, // [SVG_CURSOR_KEY.CURSOR]: CursorSvgSource,
	[SVG_CURSOR_KEY.GRAB]: GrabSvgSource,
	[SVG_CURSOR_KEY.GRABBING]: GrabbingSvgSource,
	[SVG_CURSOR_KEY.MOVE]: MoveSvgSource,
} as const

export type SvgCursorSource = (typeof SVG_CURSOR_SOURCE)[keyof typeof SVG_CURSOR_SOURCE]

type SvgCursorSourceRecord = {
	[key in SvgCursorKey]: string
}

export type SvgCursorImageRecord = {
	[key in SvgCursorKey]: HTMLImageElement
}

const loadImagePromise = (image: HTMLImageElement): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		image.onload = () => resolve(image)
		image.onerror = reject
		// image.src = src
	})
}

const mapSvgCursorSourcesToImages = async (
	sources: SvgCursorSourceRecord,
): Promise<SvgCursorImageRecord> => {
	const entries = Object.entries(sources)
	const promises = entries.map(async ([key, value]) => {
		const image = new Image()
		image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(value)
		const htmlImageElement = await loadImagePromise(image)
		return [key as SvgCursorKey, htmlImageElement] as const
	})
	const results = await Promise.all(promises)
	console.log('results', results)
	console.log('Object.fromEntries(results)', Object.fromEntries(results))
	return Object.fromEntries(results) as SvgCursorImageRecord
}

const svgCursorImagesPromise = mapSvgCursorSourcesToImages(SVG_CURSOR_SOURCE)

export function initSvgCursorImages() {
	return svgCursorImagesPromise
	/*Promise.all(
	 (() => {
	 const obs = Object.entries(svgSourcesRecord).map(async ([key, value]) => {
	 const image = new Image()
	 image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(value)
	 const htmlImageElement = await loadImagePromise(image)
	 const cursorKey = key as SvgCursorKey
	 return {
	 [cursorKey]: htmlImageElement,
	 }
	 })
	 return obs
	 })(),
	 )

	 Promise.all(
	 Object.entries(svgSourcesRecord).reduce(async ([key, value], [key, value]) => {
	 const image = new Image()
	 image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(value)
	 const htmlImageElement = await loadImagePromise(image)
	 const cursorKey = key as SvgCursorKey
	 return {
	 [cursorKey]: htmlImageElement,
	 }
	 }, {}), // mapToRe
	 )

	 Promise.all(
	 Object.entries(svgSourcesRecord)
	 .map(async ([key, value]) => {
	 const image = new Image()
	 image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(value)
	 const htmlImageElement = await loadImagePromise(image)
	 const cursorKey = key as SvgCursorKey
	 return {
	 [cursorKey]: htmlImageElement,
	 }
	 })
	 .reduce(async (prev, next) => {
	 const prevValue = prev
	 const nextValue = await next
	 return {
	 ...prevValue,
	 [nextValue]: next,
	 }
	 }, {}), // mapToRe
	 )

	 return Promise.all(
	 Object.entries(svgSourcesRecord).map(async ([key, value]) => {
	 const image = new Image()
	 image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(value)
	 const htmlImageElement = await loadImagePromise(image)
	 const cursorKey = key as SvgCursorKey
	 return {
	 [cursorKey]: htmlImageElement,
	 }
	 }), // mapToRe
	 )*/
}

/*const loadImage = (src: string): Promise<HTMLImageElement> => {
 return new Promise((resolve, reject) => {
 const image = new Image()
 image.addEventListener('load', () => {
 resolve(image)
 })
 image.addEventListener('error', (error) => {
 reject(error)
 })
 image.src = src
 })*/
// }

// loadImage('').then(image => image.loa)
