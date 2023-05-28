let isDragging = false

function handleTouch(event: TouchEvent, singleTouchHandler: (event: TouchEvent) => void) {
	if (event.touches.length == 1) {
		singleTouchHandler(event)
	} else if (event.type == 'touchmove' && event.touches.length == 2) {
		isDragging = false
		handlePinch(event)
	}
}

let initialPinchDistance: number | null = null

// let lastZoom = cameraZoom

function handlePinch(event: TouchEvent) {
	event.preventDefault()

	const touch1 = { x: event.touches[0].clientX, y: event.touches[0].clientY }
	const touch2 = { x: event.touches[1].clientX, y: event.touches[1].clientY }

	// This is distance squared, but no need for an expensive sqrt as it's only used in ratio
	const currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2

	if (initialPinchDistance == null) {
		initialPinchDistance = currentDistance
	} else {
		// adjustZoom(null, currentDistance / initialPinchDistance)
	}
}
