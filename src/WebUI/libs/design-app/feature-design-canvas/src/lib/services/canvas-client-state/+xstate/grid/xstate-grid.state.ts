export type AdjustedToMoveState = {
	singleToMove: boolean
	multipleToMove: boolean
}
export const InitialAdjustedToMoveState: AdjustedToMoveState = {
	singleToMove: false,
	multipleToMove: false,
}
export const TO_MOVE_STATE_KEY = 'ToMoveState'
export const TO_MOVE_STATE = {
	NO_MOVE: 'NoMove',
	SINGLE_MOVE_IN_PROGRESS: 'SingleMoveInProgress',
	MULTIPLE_MOVE_IN_PROGRESS: 'MultipleMoveInProgress',
} as const

export type ToMoveState = (typeof TO_MOVE_STATE)[keyof typeof TO_MOVE_STATE]

export const MATCHES_TO_MOVE_STATE = {
	STATE: 'ToMoveState',
	NO_MOVE: 'ToMoveState.NoMove',
	SINGLE_MOVE_IN_PROGRESS: 'ToMoveState.SingleMoveInProgress',
	MULTIPLE_MOVE_IN_PROGRESS: 'ToMoveState.MultipleMoveInProgress',
} as const
