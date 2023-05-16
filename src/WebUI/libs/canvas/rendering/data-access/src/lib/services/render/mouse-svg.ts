/*
 export const drawMouseSvg = (
 ctx: CanvasRenderingContext2D,
 mouseSvg: CanvasRenderOptions['mouseSvg'],
 */

import { Point } from '@shared/data-access/models'

// language=HTML
export const MouseSvgSource = `
	<svg version='1.1'
	     id='Capa_1'
	     xmlns='http://www.w3.org/2000/svg'
	     xmlns:xlink='http://www.w3.org/1999/xlink'
	     x='0px'
	     y='0px'
	     viewBox='0 0 512.001 512.001'
	     style='enable-background:new 0 0 512.001 512.001;'
	     xml:space='preserve'>
<g>
\t<g>
\t\t<path d='M429.742,319.31L82.49,0l-0.231,471.744l105.375-100.826l61.89,141.083l96.559-42.358l-61.89-141.083L429.742,319.31z
\t\t\t M306.563,454.222l-41.62,18.259l-67.066-152.879l-85.589,81.894l0.164-333.193l245.264,225.529l-118.219,7.512L306.563,454.222z'
    />
\t</g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
		<g>
</g>
</svg>

`

export const GetMouseSvg = () => {
	const image = new Image()
	image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(MouseSvgSource)
	return image
}

export const drawMouseSvg = (ctx: CanvasRenderingContext2D) => {
	// const image = new Image();
	// image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(MouseSvgSource)
	const image = GetMouseSvg()
	ctx.drawImage(image, 100, 100)
}

export const SVGIcons = (point: Point) => ({
	'cursor-arrow-rays.svg': {
		draw: function (ctx: CanvasRenderingContext2D) {
			ctx.save()
			// ctx.set

			ctx.resetTransform()
			ctx.translate(point.x, point.y)
			// ctx.scale(-scale, -scale)
			// ctx.scale(1, 1)
			ctx.save()
			ctx.strokeStyle = 'rgba(0,0,0,0)'
			ctx.miterLimit = 4
			ctx.font = "15px ''"
			ctx.fillStyle = 'rgba(0,0,0,0)'
			ctx.font = "   15px ''"
			ctx.save()
			ctx.fillStyle = 'rgba(0,0,0,0)'
			ctx.strokeStyle = '#0F172A'
			ctx.lineWidth = 1.5
			ctx.lineCap = 'round'
			ctx.lineJoin = 'round'
			ctx.font = "   15px ''"
			ctx.beginPath()
			ctx.moveTo(15.0423, 21.6718)
			ctx.lineTo(13.6835, 16.6007)
			ctx.moveTo(13.6835, 16.6007)
			ctx.lineTo(11.1741, 18.826)
			ctx.lineTo(11.7425, 9.35623)
			ctx.lineTo(16.9697, 17.2731)
			ctx.lineTo(13.6835, 16.6007)
			ctx.closePath()
			ctx.moveTo(12, 2.25)
			ctx.lineTo(12, 4.5)
			ctx.moveTo(17.8336, 4.66637)
			ctx.lineTo(16.2426, 6.25736)
			ctx.moveTo(20.25, 10.5)
			ctx.lineTo(18, 10.5)
			ctx.moveTo(7.75736, 14.7426)
			ctx.lineTo(6.16637, 16.3336)
			ctx.moveTo(6, 10.5)
			ctx.lineTo(3.75, 10.5)
			ctx.moveTo(7.75736, 6.25736)
			ctx.lineTo(6.16637, 4.66637)
			ctx.fill()
			ctx.stroke()
			ctx.restore()
			ctx.restore()
			ctx.restore()
		},
	},
})
// SVGIcons['cursor-arrow-rays.svg'].draw(new CanvasRenderingContext2D())

/*
 export const drawMouseSvg2 = (ctx: CanvasRenderingContext2D) => {
 const image = new Image()
 image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(MouseSvgSource)
 ctx.drawImage(image, 100, 100)
 }
 */
