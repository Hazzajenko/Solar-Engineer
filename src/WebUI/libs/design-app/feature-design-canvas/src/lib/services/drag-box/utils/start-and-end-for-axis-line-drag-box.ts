import { AXIS, Axis, TransformedPoint } from '../../../types'
import { EntityBounds } from '../../../utils'

export const getStartAndEndForAxisLineDragBox = (
	start: TransformedPoint,
	end: TransformedPoint,
	axis: Axis,
	axisLineBounds: EntityBounds,
) => {
	switch (axis) {
		case AXIS.X:
			return [axisLineBounds.left, start.y, axisLineBounds.right, end.y]
		case AXIS.Y:
			return [axisLineBounds.left, start.y, axisLineBounds.right, end.y]
	}
}
