import { inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { toSignal } from '@angular/core/rxjs-interop'
import { MouseSvgSource } from './mouse-svg'
import { firstValueFrom } from 'rxjs'

export function injectSvgs() {
	const http = inject(HttpClient)
	// const sanitizer = inject(DomSanitizer)
	const svgPath = 'cursor/cursor'
	// const svgPath = 'assets/cursor/cursor'
	// const svgPath = 'assets/cursor-arrow-rays.svg'
	const svgIcon$ = http.get(`assets/${svgPath}.svg`, {
		responseType: 'text',
	})
	const svgSource = toSignal(svgIcon$)
	const source = svgSource() as string
	const image = new Image()
	image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)
	return image
}

export const drawCursorSvg = (ctx: CanvasRenderingContext2D) => {
	const image = new Image()
	image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(MouseSvgSource)
	ctx.drawImage(image, 100, 100)
}

// export const mapIsNotNull = map(isNotNull)

export async function injectSvgsV2() {
	const http = inject(HttpClient)
	// const svgPath = 'cursor/cursor-pink'
	const svgPath = 'cursor/cursor-v2'
	// const svgPath = 'cursor/cursor'
	/*	const svgIcon$ = await firstValueFrom(http.get(`assets/${svgPath}.svg`, {
	 responseType: 'text',
	 }))
	 const svgSource = toSignal(svgIcon$)*/
	const svgSource = await firstValueFrom(
		http.get(`assets/${svgPath}.svg`, {
			responseType: 'text',
		}),
	)
	const source = svgSource as string
	const image = new Image()
	image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(source)
	// console.log('image', image)
	return loadImageV2(image)
	// return loadImage(image.src)
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.addEventListener('load', () => {
			resolve(image)
		})
		image.addEventListener('error', (error) => {
			reject(error)
		})
		image.src = src
	})
}

const loadImageV2 = (image: HTMLImageElement): Promise<HTMLImageElement> => {
	return new Promise((resolve, reject) => {
		image.onload = () => resolve(image)
		image.onerror = reject
		// image.src = src
	})
}
