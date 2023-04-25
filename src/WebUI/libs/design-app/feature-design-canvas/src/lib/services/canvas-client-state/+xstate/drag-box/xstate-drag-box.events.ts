import { TransformedPoint } from '../../../../types'

export class SelectionBoxStarted {
	readonly type = 'SelectionBoxStarted'

	constructor(
		public readonly payload: {
			point: TransformedPoint
		},
	) {}
}

export class SelectionBoxCompleted {
	readonly type = 'SelectionBoxCompleted'

	constructor(
		public readonly payload: {
			ids: string[]
		},
	) {}
}

export class SelectionBoxCancelled {
	readonly type = 'SelectionBoxCancelled'
	readonly payload = null
}

export class CreationBoxStarted {
	readonly type = 'CreationBoxStarted'
	readonly payload = null
}

export class CreationBoxCompleted {
	readonly type = 'CreationBoxCompleted'
	readonly payload = null
}

export class CreationBoxCancelled {
	readonly type = 'CreationBoxCancelled'
	readonly payload = null
}

export class StopDragBox {
	readonly type = 'StopDragBox'
	readonly payload = null
}

export type XStateDragBoxEvent =
	| SelectionBoxStarted
	| SelectionBoxCompleted
	| SelectionBoxCancelled
	| CreationBoxStarted
	| CreationBoxCompleted
	| CreationBoxCancelled
	| StopDragBox