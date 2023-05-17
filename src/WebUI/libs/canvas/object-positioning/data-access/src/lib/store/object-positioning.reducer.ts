import { ObjectPositioningActions } from './object-positioning.actions'
import { Action, createReducer, on } from '@ngrx/store'

export const OBJECT_POSITIONING_FEATURE_KEY = 'object-positioning'

export const MOVE_ENTITY_STATE = {
	MOVING_SINGLE_ENTITY: 'MovingSingleEntity',
	MOVING_MULTIPLE_ENTITIES: 'MovingMultipleEntities',
	MOVING_NONE: 'MovingNone',
} as const

export type MoveEntityState = (typeof MOVE_ENTITY_STATE)[keyof typeof MOVE_ENTITY_STATE]

export const ROTATE_ENTITY_STATE = {
	ROTATING_SINGLE_ENTITY: 'RotatingSingleEntity',
	ROTATING_MULTIPLE_ENTITIES: 'RotatingMultipleEntities',
	ROTATING_NONE: 'RotatingNone',
} as const

export type RotateEntityState = (typeof ROTATE_ENTITY_STATE)[keyof typeof ROTATE_ENTITY_STATE]

export interface ObjectPositioningState {
	toMoveSingleEntityId: string | undefined
	toMoveMultipleEntityIds: string[]
	toMoveSpotTaken: boolean
	toMoveMultipleSpotTakenIds: string[]
	toRotateSingleEntityId: string | undefined
	toRotateMultipleEntityIds: string[]
	moveEntityState: MoveEntityState
	rotateEntityState: RotateEntityState
}

export const initialObjectPositioningState: ObjectPositioningState = {
	toMoveSingleEntityId: undefined,
	toMoveMultipleEntityIds: [],
	toMoveSpotTaken: false,
	toMoveMultipleSpotTakenIds: [],
	toRotateSingleEntityId: undefined,
	toRotateMultipleEntityIds: [],
	moveEntityState: MOVE_ENTITY_STATE.MOVING_NONE,
	rotateEntityState: ROTATE_ENTITY_STATE.ROTATING_NONE,
}

const reducer = createReducer(
	initialObjectPositioningState,

	/**
	 * * To Move Entity
	 */
	on(ObjectPositioningActions.startMovingSingleEntity, (state, { entityId }) => ({
		...state,
		toMoveSingleEntityId: entityId,
		moveEntityState: MOVE_ENTITY_STATE.MOVING_SINGLE_ENTITY,
	})),

	on(ObjectPositioningActions.startMovingMultipleEntities, (state, { entityIds }) => ({
		...state,
		toMoveSingleEntityId: undefined,
		toMoveMultipleEntityIds: entityIds,
		moveEntityState: MOVE_ENTITY_STATE.MOVING_MULTIPLE_ENTITIES,
	})),

	on(ObjectPositioningActions.setMovingSpotTaken, (state) => ({
		...state,
		toMoveSpotTaken: true,
	})),

	on(ObjectPositioningActions.setMovingSpotFree, (state) => ({
		...state,
		toMoveSpotTaken: false,
	})),

	on(
		ObjectPositioningActions.setMultipleMovingSpotsTaken,
		(state, { toMoveMultipleSpotTakenIds }) => ({
			...state,
			toMoveMultipleSpotTakenIds,
		}),
	),

	on(ObjectPositioningActions.clearMultipleMovingSpotsTaken, (state) => ({
		...state,
		toMoveMultipleSpotTakenIds: [],
	})),

	on(ObjectPositioningActions.stopMoving, (state) => ({
		...state,
		toMoveSingleEntityId: undefined,
		toMoveMultipleEntityIds: [],
		moveEntityState: MOVE_ENTITY_STATE.MOVING_NONE,
	})),

	/**
	 * * To Rotate Entity
	 */

	on(ObjectPositioningActions.startRotatingSingleEntity, (state, { entityId }) => ({
		...state,
		toRotateSingleEntityId: entityId,
		rotateEntityState: ROTATE_ENTITY_STATE.ROTATING_SINGLE_ENTITY,
	})),

	on(ObjectPositioningActions.startRotatingMultipleEntities, (state, { entityIds }) => ({
		...state,
		toRotateSingleEntityId: undefined,
		toRotateMultipleEntityIds: entityIds,
		rotateEntityState: ROTATE_ENTITY_STATE.ROTATING_MULTIPLE_ENTITIES,
	})),

	on(ObjectPositioningActions.stopRotating, (state) => ({
		...state,
		toRotateSingleEntityId: undefined,
		toRotateMultipleEntityIds: [],
		rotateEntityState: ROTATE_ENTITY_STATE.ROTATING_NONE,
	})),

	/**
	 * * Clear State
	 */

	on(ObjectPositioningActions.clearObjectPositioningState, () => ({
		...initialObjectPositioningState,
	})),
)

export function objectPositioningReducer(
	state: ObjectPositioningState | undefined,
	action: Action,
) {
	return reducer(state, action)
}
