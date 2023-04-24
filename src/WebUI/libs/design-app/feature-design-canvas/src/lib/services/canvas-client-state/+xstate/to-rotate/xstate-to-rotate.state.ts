export type AdjustedToRotateState = {
	singleRotateMode: boolean
	singleToRotate: boolean
	multipleToRotate: boolean
}

export const InitialAdjustedToRotateState: AdjustedToRotateState = {
	singleRotateMode: false,
	singleToRotate: false,
	multipleToRotate: false,
}

export const TO_ROTATE_STATE = {
	STATE: 'ToRotateState',
	NO_ROTATE: 'ToRotateState.NoRotate',
	SINGLE_ROTATE_IN_PROGRESS: 'ToRotateState.SingleRotateInProgress',
	SINGLE_ROTATE_MODE_IN_PROGRESS: 'ToRotateState.SingleRotateModeInProgress',
	MULTIPLE_ROTATE_IN_PROGRESS: 'ToRotateState.MultipleRotateInProgress',
} as const

export type ToRotateState = (typeof TO_ROTATE_STATE)[keyof typeof TO_ROTATE_STATE]
