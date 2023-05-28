const MIN_ZOOM = 0.1
export const getNormalizedZoom = (zoom: number) => {
	return Math.max(MIN_ZOOM, Math.min(zoom, 30))
}

export const getStateForZoom = (
	{
		viewportX,
		viewportY,
		nextZoom,
	}: {
		viewportX: number
		viewportY: number
		nextZoom: number
	},
	canvas: HTMLCanvasElement,
	ctx: CanvasRenderingContext2D, // appState: AppState,
) => {
	const appLayerX = viewportX - canvas.offsetLeft
	const appLayerY = viewportY - canvas.offsetTop

	const currentZoom = ctx.getTransform().a
	// const currentZoom = canvas.zoom.value

	// get original scroll position without zoom
	const baseScrollX = appLayerX - appLayerX / currentZoom
	const baseScrollY = scrollY + (appLayerY - appLayerY / currentZoom)

	// get scroll offsets for target zoom level
	const zoomOffsetScrollX = -(appLayerX - appLayerX / nextZoom)
	const zoomOffsetScrollY = -(appLayerY - appLayerY / nextZoom)

	return {
		scrollX: baseScrollX + zoomOffsetScrollX,
		scrollY: baseScrollY + zoomOffsetScrollY,
		zoom: {
			value: nextZoom,
		},
	}
}
