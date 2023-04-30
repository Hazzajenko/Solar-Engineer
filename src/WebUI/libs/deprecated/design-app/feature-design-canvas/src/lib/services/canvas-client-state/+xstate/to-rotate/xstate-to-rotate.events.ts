export class StartSingleRotateMode {
	readonly type = 'StartSingleRotateMode'
	readonly payload = null
}

export class StopSingleRotateMode {
	readonly type = 'StopSingleRotateMode'
	readonly payload = null
}

export class StartSingleRotate {
	readonly type = 'StartSingleRotate'
	readonly payload = null
}

export class StopSingleRotate {
	readonly type = 'StopSingleRotate'
	readonly payload = null
}

export class StartMultipleRotate {
	readonly type = 'StartMultipleRotate'
	readonly payload = null
}

export class StopMultipleRotate {
	readonly type = 'StopMultipleRotate'
	readonly payload = null
}

export type XStateToRotateEvent =
	| StartSingleRotateMode
	| StopSingleRotateMode
	| StartSingleRotate
	| StopSingleRotate
	| StartMultipleRotate
	| StopMultipleRotate
