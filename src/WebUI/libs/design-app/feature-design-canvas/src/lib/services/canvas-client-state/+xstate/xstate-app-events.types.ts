import { XStateDragBoxEvent } from './drag-box'
import { XStatePointerEvent } from './pointer'
import { XStateSelectedEvent } from './selected'
import { XStateToMoveEvent } from './to-move'
import { XStateToRotateEvent } from './to-rotate'
import { XStateViewEvent } from './view'


export type XStateEvent =
	| XStateSelectedEvent
	| XStateDragBoxEvent
	| XStatePointerEvent
	| XStateToMoveEvent
	| XStateToRotateEvent
	| XStateViewEvent