import { createFeature, createSelector, provideState } from '@ngrx/store'
import { makeEnvironmentProviders } from '@angular/core'
import {
	OBJECT_POSITIONING_FEATURE_KEY,
	objectPositioningReducer,
	ObjectPositioningState,
} from './object-positioning.reducer'

export const objectPositioningFeature = createFeature({
	name: OBJECT_POSITIONING_FEATURE_KEY,
	reducer: objectPositioningReducer,
	extraSelectors: ({
		selectObjectPositioningState,
		selectMoveEntityState,
		selectRotateEntityState,
		selectToMoveMultipleEntityIds,
		selectToMoveMultipleSpotTakenIds,
		selectToMoveSingleEntityId,
		selectToMoveSpotTaken,
		selectToRotateMultipleEntityIds,
		selectToRotateSingleEntityId,
	}) => ({
		selectObjectPositioningState,
		selectMoveEntityState,
		selectRotateEntityState,
		selectToMoveMultipleEntityIds,
		selectToMoveMultipleSpotTakenIds,
		selectToMoveSingleEntityId,
		selectToMoveSpotTaken,
		selectToRotateMultipleEntityIds,
		selectToRotateSingleEntityId,
		selectToMovePositioning: createSelector(
			selectObjectPositioningState,
			(state: ObjectPositioningState) => ({
				toMoveSingleEntityId: state.toMoveSingleEntityId,
				toMoveMultipleEntityIds: state.toMoveMultipleEntityIds,
				moveEntityState: state.moveEntityState,
			}),
		),
		selectToRotatePositioning: createSelector(
			selectObjectPositioningState,
			(state: ObjectPositioningState) => ({
				toRotateSingleEntityId: state.toRotateSingleEntityId,
				toRotateMultipleEntityIds: state.toRotateMultipleEntityIds,
				rotateEntityState: state.rotateEntityState,
			}),
		),
		selectCursorState: createSelector(
			selectObjectPositioningState,
			(state: ObjectPositioningState) => ({
				moveEntityState: state.moveEntityState,
				toMoveSpotTaken: state.toMoveSpotTaken,
				rotateEntityState: state.rotateEntityState,
			}),
		),
	}),
})

export function projectObjectPositioningFeature() {
	return makeEnvironmentProviders([provideState(objectPositioningFeature)])
}
