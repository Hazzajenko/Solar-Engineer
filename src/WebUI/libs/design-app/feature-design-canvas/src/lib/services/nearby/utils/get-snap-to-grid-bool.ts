import { Axis } from '../../../types'
import { checkOverlapBetweenTwoBounds, CompleteEntityBounds, EntityBounds } from '../../../utils'
import { makeBoundsSmallerByAxis } from '../ctx-fns'

export const getSnapToGridBoolean = (
	altKey: boolean,
	mouseBounds: CompleteEntityBounds,
	axis: Axis,
	axisPreviewRect: EntityBounds,
	holdAltToSnapToGrid: boolean,
): boolean => {
	if (holdAltToSnapToGrid) {
		return altKey
	} else {
		const smallerMouseBounds = makeBoundsSmallerByAxis(mouseBounds, axis)
		return checkOverlapBetweenTwoBounds(smallerMouseBounds, axisPreviewRect)
	}
}