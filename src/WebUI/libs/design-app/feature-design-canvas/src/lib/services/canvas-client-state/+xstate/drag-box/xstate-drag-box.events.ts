import { CompleteEntityBounds } from '../../../../utils';


/*
 export class SelectionBoxStarted {
 readonly type = 'SelectionBoxStarted'

 constructor(
 public readonly payload: {
 point: TransformedPoint
 },
 ) {}
 }
 */

export type SelectionBoxStarted = {
	type: 'SelectionBoxStarted'
}

/*export class SelectionBoxCompleted {
 readonly type = 'SelectionBoxCompleted'

 constructor(
 public readonly payload: {
 ids: string[]
 selectionBoxBounds: CompleteEntityBounds
 },
 ) {}
 }*/

export type SelectionBoxCompleted = {
	type: 'SelectionBoxCompleted'
	payload: {
		ids: string[]
		selectionBoxBounds: CompleteEntityBounds
	}
}

/*export class SelectionBoxCancelled {
 readonly type = 'SelectionBoxCancelled'
 readonly payload = null
 }*/

export type SelectionBoxCancelled = {
	type: 'SelectionBoxCancelled'
}

/*export class CreationBoxStarted {
 readonly type = 'CreationBoxStarted'
 readonly payload = null
 }*/

export type CreationBoxStarted = {
	type: 'CreationBoxStarted'
}

/*export class CreationBoxCompleted {
 readonly type = 'CreationBoxCompleted'
 readonly payload = null
 }*/

export type CreationBoxCompleted = {
	type: 'CreationBoxCompleted'
}

/*export class CreationBoxCancelled {
 readonly type = 'CreationBoxCancelled'
 readonly payload = null
 }*/

export type CreationBoxCancelled = {
	type: 'CreationBoxCancelled'
}

/*export class StopDragBox {
 readonly type = 'StopDragBox'
 readonly payload = null
 }*/

export type StopDragBox = {
	type: 'StopDragBox'
}

export type XStateDragBoxEvent =
	| SelectionBoxStarted
	| SelectionBoxCompleted
	| SelectionBoxCancelled
	| CreationBoxStarted
	| CreationBoxCompleted
	| CreationBoxCancelled
	| StopDragBox