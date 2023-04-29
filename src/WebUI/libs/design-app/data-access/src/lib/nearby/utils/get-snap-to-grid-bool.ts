import { makeBoundsSmallerByAxis } from '../ctx-fns'
import { Axis, CompleteEntityBounds, EntityBounds } from '@design-app/shared'
import { checkOverlapBetweenTwoBounds } from '@design-app/utils'

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