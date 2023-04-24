/*export type ClearEntitySelected = {
 type: 'ClearEntitySelected'
 payload: null
 }

 export type CancelSelected = {
 type: 'CancelSelected'
 payload: null
 }

 export type ClickOnEntity = {
 type: 'ClickOnEntity'
 payload: {
 id: string
 }
 }

 export type MultipleEntitiesSelected = {
 type: 'MultipleEntitiesSelected'
 payload: null
 }
 // MultipleEntitiesSelected

 export type ClickedOnDifferentEntity = {
 type: 'ClickedOnDifferentEntity'
 payload: {
 id: string
 }
 }

 export type AddEntitiesToMultipleSelected = {
 type: 'AddEntitiesToMultipleSelected'
 payload: {
 ids: string[]
 }
 }

 export type RemoveEntitiesFromMultipleSelected = {
 type: 'RemoveEntitiesFromMultipleSelected'
 payload: {
 ids: string[]
 }
 }*/
import { TransformedPoint } from '@design-app/feature-design-canvas';


export class PointerHoverOverEntity {
	readonly type = 'PointerHoverOverEntity'

	constructor(
		public readonly payload: {
			id: string
			point: TransformedPoint
		},
	) {}
}

export class PointerLeaveEntity {
	readonly type = 'PointerLeaveEntity'

	constructor(
		public readonly payload: {
			point: TransformedPoint
		},
	) {}
}

export class PointerDown {
	readonly type = 'PointerDown'

	constructor(
		public readonly payload: {
			point: TransformedPoint
		},
	) {}
}

export class PointerUp {
	readonly type = 'PointerUp'

	constructor(
		public readonly payload: {
			point: TransformedPoint
		},
	) {}
}

export class PointerDownOnEntity {
	readonly type = 'PointerDownOnEntity'

	constructor(
		public readonly payload: {
			id: string
			point: TransformedPoint
		},
	) {}
}

export class PointerUpOnEntity {
	readonly type = 'PointerUpOnEntity'

	constructor(
		public readonly payload: {
			point: TransformedPoint
		},
	) {}
}

export class PointerMove {
	readonly type = 'PointerMove'

	constructor(
		public readonly payload: {
			event: PointerEvent
			point: TransformedPoint
		},
	) {}
}

export type XStatePointerEvent =
	| PointerHoverOverEntity
	| PointerLeaveEntity
	| PointerDown
	| PointerUp
	| PointerDownOnEntity
	| PointerUpOnEntity
	| PointerMove

// | EntitiesFoundInSelectionBox
// RemoveEntitiesFromMultipleSelected
/*

 export type XStateSelectedEvent =
 | {
 type: 'ClickElsewhere'
 payload: null
 }
 | {
 type: 'CancelSelected'
 payload: null
 }
 | {
 type: 'ClickOnEntity'
 payload: {
 id: string
 }
 }
 | {
 type: 'SelectedMultipleEntities'
 payload: {
 ids: string[]
 }
 }
 | {
 type: 'ClickedOnDifferentEntity'
 payload: {
 id: string
 }
 }
 | {
 type: 'AddEntityToMultipleSelected'
 payload: {
 id: string
 }
 }*/

/*export type ActionModule = typeof import('./events/events')
 export type Action = ActionModule[keyof ActionModule]
 const ac: Action = 'ClickOnEntity'*/
// const fff : Action = id => {}
/*const yyo: ActionModule = {
 ClickOnEntity: (id: string) => ({
 type: 'ClickOnEntity',

 }),
 }*/
/*const yyo: ActionModule = ''
 }

 export type Action = ActionModule[keyof ActionModule]*/
// const yo : Action =