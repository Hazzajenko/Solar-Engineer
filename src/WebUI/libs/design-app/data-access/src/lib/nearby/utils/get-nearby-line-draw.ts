import { GraphicsStateSnapshot } from '../../graphics'
import {
	getCenterLineBetweenTwoEntitiesWithPreviewFn,
	getEntityAxisCenterWithEntityPreviewFn,
	getEntityGridLineWithEntityPreviewFn,
} from '../ctx-fns'
import { CanvasColor, CompleteEntityBounds, NearbyEntity } from '@design-app/shared'

export const getNearbyLineDrawCtxFnFromGraphicsSnapshot = (
	graphicsSnapshot: GraphicsStateSnapshot,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	altKey: boolean,
	holdAltToSnapToGrid: boolean,
	isMovingExistingEntity: boolean,
) => {
	switch (true) {
		case graphicsSnapshot.matches('NearbyLinesState.NearbyLinesEnabled.TwoSideAxisLines'):
			return getEntityGridLineWithEntityPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)

		case graphicsSnapshot.matches('NearbyLinesState.NearbyLinesEnabled.CenterLineScreenSize'):
			return getEntityAxisCenterWithEntityPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)

		case graphicsSnapshot.matches(
			'NearbyLinesState.NearbyLinesEnabled.CenterLineBetweenTwoEntities',
		):
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
			throw new Error(`${graphicsSnapshot.value} is not implemented`)
	}
}