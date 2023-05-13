export type StartSingleRotateMode = {
	type: 'StartSingleRotateMode'
}

export type StopSingleRotateMode = {
	type: 'StopSingleRotateMode'
}

export type StartSingleRotate = {
	type: 'StartSingleRotate'
}

export type StopSingleRotate = {
	type: 'StopSingleRotate'
}

export type StartMultipleRotate = {
	type: 'StartMultipleRotate'
}

export type StopMultipleRotate = {
	type: 'StopMultipleRotate'
}

export type ToRotateStateEvent =
	| StartSingleRotateMode
	| StopSingleRotateMode
	| StartSingleRotate
	| StopSingleRotate
	| StartMultipleRotate
	| StopMultipleRotate
