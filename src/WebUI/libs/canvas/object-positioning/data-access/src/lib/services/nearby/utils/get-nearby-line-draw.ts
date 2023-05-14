import { GraphicsState, NEARBY_LINES_STATE } from '@canvas/graphics/data-access'
import {
	getCenterLineBetweenTwoEntitiesWithPreviewFn,
	getEntityAxisCenterWithEntityPreviewFn,
	getEntityGridLineWithEntityPreviewFn,
} from '../ctx-fns'
import { CanvasColor, CompleteEntityBounds, NearbyEntity } from '@shared/data-access/models'

export const getNearbyLineDrawCtxFnFromNearbyLinesState = (
	nearbyLinesState: GraphicsState['nearbyLinesState'],
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	altKey: boolean,
	holdAltToSnapToGrid: boolean,
	isMovingExistingEntity: boolean,
) => {
	switch (nearbyLinesState) {
		case NEARBY_LINES_STATE.TWO_SIDE_AXIS_LINES:
			return getEntityGridLineWithEntityPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)
		case NEARBY_LINES_STATE.CENTER_LINE_SCREEN_SIZE:
			return getEntityAxisCenterWithEntityPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)
		case NEARBY_LINES_STATE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
			return getCenterLineBetweenTwoEntitiesWithPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)
		default:
			throw new Error(`${nearbyLinesState} is not implemented`)
	}
}
