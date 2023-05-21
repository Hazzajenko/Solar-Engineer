export function setupCanvas(canvas: HTMLCanvasElement) {
	const ctx = canvas.getContext('2d')
	if (!ctx) {
		throw new Error('Could not get canvas context')
	}
	canvas.style.position = 'absolute'
	canvas.style.top = '0'
	canvas.style.left = '0'
	canvas.style.bottom = '0'
	canvas.style.right = '0'
	canvas.style.zIndex = '10'
	canvas.width = window.innerWidth
	canvas.height = window.innerHeight
	canvas.style.width = `${window.innerWidth}px`
	canvas.style.height = `${window.innerHeight}px`
	ctx.fillStyle = '#8ED6FF'
	ctx.lineWidth = 1
	ctx.strokeStyle = 'black'
	ctx.lineCap = 'round'
	ctx.lineJoin = 'round'
	ctx.setLineDash([])

	// ctx.fillRect(0, 0, canvas.width, canvas.height)
	// ctx.font = '48px serif'
	// ctx.fillText('Hello world', 10, 50)
	// ctx.strokeText('Hello world', 10, 100)

	return { canvas, ctx }
}
