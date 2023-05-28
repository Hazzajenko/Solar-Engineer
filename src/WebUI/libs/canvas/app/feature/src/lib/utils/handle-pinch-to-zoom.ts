import { Gesture } from '@shared/data-access/models'
import { getCenter, getDistance } from '@shared/utils'
import { getTransformedPointFromXY } from '@canvas/object-positioning/data-access'
import { DeepNonNullable } from 'utility-types'

export const isReadyForPinchToZoom = (gesture: Gesture): gesture is DeepNonNullable<Gesture> => {
	return (
		gesture.pointers.size === 2 &&
		!!gesture.lastCenter &&
		!!gesture.initialScale &&
		!!gesture.initialDistance &&
		!!gesture.initialCenter &&
		!!gesture.lastDistance
	)
}
export const handlePinchToZoom = (
	event: TouchEvent,
	ctx: CanvasRenderingContext2D,
	gesture: DeepNonNullable<Gesture>,
) => {
	if (event.touches.length < 2) {
		return false
	}
	const touches = event.touches
	for (let i = 0; i < touches.length; i++) {
		const touch = touches[i]
		const pointerId = touch.identifier
		const pointer = gesture.pointers.get(pointerId)
		if (pointer) {
			pointer.x = touch.clientX
			pointer.y = touch.clientY
		}
	}
	const center = getCenter(gesture.pointers)
	const deltaX = center.x - gesture.lastCenter.x
	const deltaY = center.y - gesture.lastCenter.y
	gesture.lastCenter = center

	const distance = getDistance(Array.from(gesture.pointers.values()))
	const scaleFactor = distance / gesture.lastDistance
	gesture.lastDistance = distance

	const transformedInitialCenter = getTransformedPointFromXY(ctx, gesture.initialCenter)
	ctx.translate(transformedInitialCenter.x, transformedInitialCenter.y)
	ctx.scale(scaleFactor, scaleFactor)
	ctx.translate(-transformedInitialCenter.x, -transformedInitialCenter.y)
	ctx.translate(deltaX, deltaY)
	return true
}
