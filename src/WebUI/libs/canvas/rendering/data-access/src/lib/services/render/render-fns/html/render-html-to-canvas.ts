import { Point, Size } from '@shared/data-access/models'

export const renderHtmlToCanvas = (
	ctx: CanvasRenderingContext2D,
	html: string,
	point: Point,
	size: Size,
) => {
	// language=HTML
	const data = `data:image/svg+xml;charset=utf-8,
	<svg xmlns='http://www.w3.org/2000/svg'
	     width='${size.width}'
	     height='${size.height}'>
		<foreignObject width='100%'
		               height='100%'>
			${htmlToXml(html)}
		</foreignObject>
	</svg>`

	const img = new Image()
	img.onload = () => {
		ctx.drawImage(img, point.x, point.y)
	}
	img.src = data
}

export const htmlToXml = (html: string) => {
	const doc = document.implementation.createHTMLDocument('')
	doc.write(html)
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	doc.documentElement.setAttribute('xmlns', doc.documentElement.namespaceURI!)
	return new XMLSerializer().serializeToString(doc.body)
}
