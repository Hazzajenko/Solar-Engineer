import { GraphicsXStateSnapshot } from '../../graphics'
import { GraphicsState, NEARBY_LINES_STATE } from '../../graphics-store'
import {
	getCenterLineBetweenTwoEntitiesWithPreviewFn,
	getEntityAxisCenterWithEntityPreviewFn,
	getEntityGridLineWithEntityPreviewFn,
} from '../ctx-fns'
import { CanvasColor, CompleteEntityBounds, NearbyEntity } from '@design-app/shared'

export const getNearbyLineDrawCtxFnFromGraphicsSnapshot = (
	graphicsSnapshot: GraphicsXStateSnapshot,
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
/*
 export const getNearbyLineDrawCtxFnFromAppNgrxStoreSnapshot = (
 graphicsStateSnapshot: GraphicsStateSnapshot,
 axisPreviewRect: CompleteEntityBounds,
 mouseBounds: CompleteEntityBounds,
 closestEntity: NearbyEntity,
 fillStyle: CanvasColor,
 altKey: boolean,
 holdAltToSnapToGrid: boolean,
 isMovingExistingEntity: boolean,
 ) => {
 switch (graphicsStateSnapshot.state.nearbyLines) {
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
 throw new Error(`${graphicsStateSnapshot.state.nearbyLines} is not implemented`)
 }
 }*/

export const getNearbyLineDrawCtxFnFromNearbyLinesState = (
	nearbyLinesState: GraphicsState['nearbyLines'],
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