export type ToRotateStateContext = {
	singleRotateMode: boolean
	singleToRotate: boolean
	multipleToRotate: boolean
}

export const InitialToRotateContext: ToRotateStateContext = {
	singleRotateMode: false,
	singleToRotate: false,
	multipleToRotate: false,
}

// export const TO_ROTATE_STATE_KEY = 'ToRotateState'
//
/*export const TO_ROTATE_STATE = {
	NO_ROTATE: 'NoRotate',
	SINGLE_ROTATE_IN_PROGRESS: 'SingleRotateInProgress',
	SINGLE_ROTATE_MODE_IN_PROGRESS: 'SingleRotateModeInProgress',
	MULTIPLE_ROTATE_IN_PROGRESS: 'MultipleRotateInProgress',
} as const*/

// export type ToRotateState = (typeof TO_ROTATE_STATE)[keyof typeof TO_ROTATE_STATE]

/*
export const MATCHES_TO_ROTATE_STATE = {
	STATE: 'ToRotateState',
	NO_ROTATE: 'ToRotateState.NoRotate',
	SINGLE_ROTATE_IN_PROGRESS: 'ToRotateState.SingleRotateInProgress',
	SINGLE_ROTATE_MODE_IN_PROGRESS: 'ToRotateState.SingleRotateModeInProgress',
	MULTIPLE_ROTATE_IN_PROGRESS: 'ToRotateState.MultipleRotateInProgress',
} as const
*/
