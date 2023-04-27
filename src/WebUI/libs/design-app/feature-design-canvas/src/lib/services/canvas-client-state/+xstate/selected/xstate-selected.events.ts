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

export class ClearEntitySelected {
	readonly type = 'ClearEntitySelected'
	readonly payload = null
}

export class CancelSelected {
	readonly type = 'CancelSelected'
	readonly payload = null
}

export class SelectedSingleEntity {
	readonly type = 'SelectedSingleEntity'

	constructor(
		public readonly payload: {
			id: string
		},
	) {}
}

export class SetMultipleSelectedEntities {
	readonly type = 'SetMultipleSelectedEntities'

	constructor(
		public readonly payload: {
			ids: string[]
		},
	) {}
}

export class SelectedDifferentEntity {
	readonly type = 'SelectedDifferentEntity'

	constructor(
		public readonly payload: {
			id: string
		},
	) {}
}

export class AddEntitiesToMultipleSelected {
	readonly type = 'AddEntitiesToMultipleSelected'

	constructor(
		public readonly payload: {
			ids: string[]
		},
	) {}
}

export class RemoveEntitiesFromMultipleSelected {
	readonly type = 'RemoveEntitiesFromMultipleSelected'

	constructor(
		public readonly payload: {
			ids: string[]
		},
	) {}
}

export type ClearSelectedState = {
	type: 'ClearSelectedState'
}

export type SetSelectedString = {
	type: 'SetSelectedString'
	payload: {
		stringId: string
	}
}

export type ClearStringSelected = {
	type: 'ClearStringSelected'
}

// const yo = function SelectEntitiesInSelectionBox(     ctx,     event): {payload: {ids: any[]}, type: string}

/*export type EntitiesFoundInSelectionBox = {
 type: 'EntitiesFoundInSelectionBox'
 payload: {
 ids: string[]
 }
 }*/

export type XStateSelectedEvent =
	| ClearEntitySelected
	| CancelSelected
	| SelectedSingleEntity
	| SetMultipleSelectedEntities
	| SelectedDifferentEntity
	| AddEntitiesToMultipleSelected
	| RemoveEntitiesFromMultipleSelected
	| SetSelectedString
	| ClearStringSelected
	| ClearSelectedState
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
