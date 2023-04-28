/*
 export class ClearEntitySelected {
 readonly type = 'ClearEntitySelected'
 readonly payload = null
 }

 export class CancelSelected {
 readonly type = 'CancelSelected'
 readonly payload = null
 }
 */

export type ClearEntitySelected = {
	type: 'ClearEntitySelected'
}

export type CancelSelected = {
	type: 'CancelSelected'
}

/*export class SelectedSingleEntity {
 readonly type = 'SelectedSingleEntity'

 constructor(
 public readonly payload: {
 id: string
 },
 ) {}
 }*/

export type SelectedSingleEntity = {
	type: 'SelectedSingleEntity'
	payload: {
		id: string
	}
}

/*export class SetMultipleSelectedEntities {
 readonly type = 'SetMultipleSelectedEntities'

 constructor(
 public readonly payload: {
 ids: string[]
 },
 ) {}
 }*/

export type SetMultipleSelectedEntities = {
	type: 'SetMultipleSelectedEntities'
	payload: {
		ids: string[]
	}
}

/*export class SelectedDifferentEntity {
 readonly type = 'SelectedDifferentEntity'

 constructor(
 public readonly payload: {
 id: string
 },
 ) {}
 }*/

export type SelectedDifferentEntity = {
	type: 'SelectedDifferentEntity'
	payload: {
		id: string
	}
}

/*
 export class AddEntitiesToMultipleSelected {
 readonly type = 'AddEntitiesToMultipleSelected'

 constructor(
 public readonly payload: {
 ids: string[]
 },
 ) {}
 }
 */

export type AddEntitiesToMultipleSelected = {
	type: 'AddEntitiesToMultipleSelected'
	payload: {
		ids: string[]
	}
}

/*export class RemoveEntitiesFromMultipleSelected {
 readonly type = 'RemoveEntitiesFromMultipleSelected'

 constructor(
 public readonly payload: {
 ids: string[]
 },
 ) {}
 }*/

export type RemoveEntitiesFromMultipleSelected = {
	type: 'RemoveEntitiesFromMultipleSelected'
	payload: {
		ids: string[]
	}
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

export type SelectedStringRollbackToSingle = {
	type: 'SelectedStringRollbackToSingle'
}

export type SelectedStringRollbackToMultiple = {
	type: 'SelectedStringRollbackToMultiple'
}

export type SelectedRollback = {
	type: 'SelectedRollback'
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
	| SelectedRollback
	| SelectedStringRollbackToSingle
	| SelectedStringRollbackToMultiple
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
