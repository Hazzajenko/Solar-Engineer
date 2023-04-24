import { XStateDragBoxEvent } from './drag-box'
import { XStatePointerEvent } from './pointer'
import { XStateSelectedEvent } from './selected'
import { XStateToMoveEvent } from './to-move'

export type XStateEvent =
	| XStateSelectedEvent
	| XStateDragBoxEvent
	| XStatePointerEvent
	| XStateToMoveEvent