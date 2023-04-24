import { TransformedPoint } from '../../../../types'

export class StartSelectionBox {
	readonly type = 'StartSelectionBox'

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

export class StopDragBox {
	readonly type = 'StopDragBox'
	readonly payload = null
}

export type XStateDragBoxEvent =
	| StartSelectionBox
	| SelectionBoxCompleted
	| SelectionBoxCancelled
	| StopDragBox