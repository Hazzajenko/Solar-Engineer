import {
	OBJECT_POSITIONING_FEATURE_KEY,
	ObjectPositioningState,
} from './object-positioning.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'

export const selectObjectPositioningState = createFeatureSelector<ObjectPositioningState>(
	OBJECT_POSITIONING_FEATURE_KEY,
)

export const selectToMovePositioning = createSelector(
	selectObjectPositioningState,
	(state: ObjectPositioningState) => ({
		toMoveSingleEntityId: state.toMoveSingleEntityId,
		toMoveMultipleEntityIds: state.toMoveMultipleEntityIds,
		moveEntityState: state.moveEntityState,
	}),
)

export const selectToRotatePositioning = createSelector(
	selectObjectPositioningState,
	(state: ObjectPositioningState) => ({
		toRotateSingleEntityId: state.toRotateSingleEntityId,
		toRotateMultipleEntityIds: state.toRotateMultipleEntityIds,
		rotateEntityState: state.rotateEntityState,
	}),
)