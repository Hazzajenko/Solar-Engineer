import {
	GraphicsStateSnapshot,
	NEARBY_GRAPHICS_STATE_MODE,
	NearbyGraphicsStateMode,
} from '../components'
import {
	getCenterLineBetweenTwoEntitiesWithPreviewFn,
	getEntityAxisCenterWithEntityPreviewFn,
	getEntityGridLineWithEntityPreviewFn,
	NearbyEntity,
} from '../services'
import { CanvasColor } from '../types'
import { CompleteEntityBounds } from '../utils'

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

export const getNearbyLineDrawCtxFnFromGraphicsStateType = (
	nearbyMode: NearbyGraphicsStateMode,
	altKey: boolean,
	axisPreviewRect: CompleteEntityBounds,
	mouseBounds: CompleteEntityBounds,
	closestEntity: NearbyEntity,
	fillStyle: CanvasColor,
	holdAltToSnapToGrid: boolean,
	isMovingExistingEntity: boolean,
) => {
	switch (nearbyMode) {
		case NEARBY_GRAPHICS_STATE_MODE.TWO_SIDE_AXIS_LINES:
			return getEntityGridLineWithEntityPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)

		case NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_SCREEN_SIZE:
			return getEntityAxisCenterWithEntityPreviewFn(
				altKey,
				axisPreviewRect,
				mouseBounds,
				closestEntity,
				fillStyle,
				holdAltToSnapToGrid,
				isMovingExistingEntity,
			)

		case NEARBY_GRAPHICS_STATE_MODE.CENTER_LINE_BETWEEN_TWO_ENTITIES:
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
			throw new Error(`${nearbyMode} is not implemented`)
	}
}