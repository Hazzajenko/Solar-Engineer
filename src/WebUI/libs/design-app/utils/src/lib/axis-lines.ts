import {
	AXIS,
	Axis,
	EntityBounds,
	SAME_AXIS_POSITION,
	SameAxisPosition,
} from '@design-app/feature-design-canvas'

export const getEntityAxisGridLinesByAxisV2 = (bounds: EntityBounds, axis: Axis): number[][] => {
	if (axis === AXIS.Y) {
		return [
			[0, bounds.top, window.innerWidth, bounds.top],
			[0, bounds.bottom, window.innerWidth, bounds.bottom],
		]
	}
	return [
		[bounds.left, 0, bounds.left, window.innerHeight],
		[bounds.right, 0, bounds.right, window.innerHeight],
	]
}

export const getSameAxisPosition = (
	start: EntityBounds,
	end: EntityBounds,
	axis: Axis,
): SameAxisPosition | undefined => {
	if (axis === 'x') {
		if (start.centerY > end.centerY) {
			return SAME_AXIS_POSITION.TOP
		}
		if (start.centerY < end.centerY) {
			return SAME_AXIS_POSITION.BOTTOM
		}
	}
	if (axis === 'y') {
		if (start.centerX > end.centerX) {
			return SAME_AXIS_POSITION.LEFT
		}
		if (start.centerX < end.centerX) {
			return SAME_AXIS_POSITION.RIGHT
		}
	}
	return undefined
}

export const getOppositeSameAxisPosition = (axisPos: SameAxisPosition): SameAxisPosition => {
	switch (axisPos) {
		case SAME_AXIS_POSITION.TOP:
			return SAME_AXIS_POSITION.BOTTOM
		case SAME_AXIS_POSITION.BOTTOM:
			return SAME_AXIS_POSITION.TOP
		case SAME_AXIS_POSITION.LEFT:
			return SAME_AXIS_POSITION.RIGHT
		case SAME_AXIS_POSITION.RIGHT:
			return SAME_AXIS_POSITION.LEFT
	}
}