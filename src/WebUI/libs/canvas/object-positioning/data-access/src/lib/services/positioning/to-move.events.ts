export type StartSingleMove = {
	type: 'StartSingleMove'
}

export type StopSingleMove = {
	type: 'StopSingleMove'
}

export type StartMultipleMove = {
	type: 'StartMultipleMove'
}

export type StopMultipleMove = {
	type: 'StopMultipleMove'
}

export type ToMoveStateEvent =
	| StartSingleMove
	| StopSingleMove
	| StartMultipleMove
	| StopMultipleMove
