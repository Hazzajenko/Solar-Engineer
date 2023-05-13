import { CompleteEntityBounds } from '@design-app/shared'

export type SelectionBoxStarted = {
	type: 'SelectionBoxStarted'
}

export type SelectionBoxCompleted = {
	type: 'SelectionBoxCompleted'
	payload: {
		ids: string[]
		selectionBoxBounds: CompleteEntityBounds
	}
}

export type SelectionBoxCancelled = {
	type: 'SelectionBoxCancelled'
}

export type CreationBoxStarted = {
	type: 'CreationBoxStarted'
}

export type CreationBoxCompleted = {
	type: 'CreationBoxCompleted'
}

export type CreationBoxCancelled = {
	type: 'CreationBoxCancelled'
}

export type StopDragBox = {
	type: 'StopDragBox'
}

export type DragBoxStateEvent =
	| SelectionBoxStarted
	| SelectionBoxCompleted
	| SelectionBoxCancelled
	| CreationBoxStarted
	| CreationBoxCompleted
	| CreationBoxCancelled
	| StopDragBox