export type ClearEntitySelected = {
	type: 'ClearEntitySelected'
}

export type ClearMultipleSelectedEntities = {
	type: 'ClearMultipleSelectedEntities'
}

export type CancelSelected = {
	type: 'CancelSelected'
}

export type SelectedSingleEntity = {
	type: 'SelectedSingleEntity'
	payload: {
		id: string
	}
}

export type SetMultipleSelectedEntities = {
	type: 'SetMultipleSelectedEntities'
	payload: {
		ids: string[]
	}
}

export type SelectedDifferentEntity = {
	type: 'SelectedDifferentEntity'
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

export type SelectedStateEvent =
	| ClearEntitySelected
	| ClearMultipleSelectedEntities
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

type SelectedEventTypes = SelectedStateEvent['type']
type AllSelectedEventsWithPayload = Extract<
	SelectedStateEvent,
	{
		payload: object
	}
>

type SelectedEventsWithPayloadByType<T extends SelectedEventTypes> = Extract<
	AllSelectedEventsWithPayload,
	{
		type: T
	}
>

type SelectedEventByType<T extends SelectedEventTypes> = Extract<
	SelectedStateEvent,
	{
		type: T
	}
>

type SelectedEventPayloadOrNullByType<T extends SelectedEventTypes> =
	SelectedEventByType<T> extends {
		type: T
		payload: object
	}
		? SelectedEventsWithPayloadByType<T>['payload']
		: null
export const SELECTED_EVENT = <T extends SelectedEventTypes>(
	type: T,
	payload: SelectedEventPayloadOrNullByType<T>,
) => {
	switch (type) {
		case 'ClearEntitySelected':
			return { type }
		case 'CancelSelected':
			return { type }
		case 'SelectedSingleEntity':
			if (!payload) throw new Error('Payload is required')
			return { type, payload }
		case 'SetMultipleSelectedEntities':
			if (!payload) throw new Error('Payload is required')
			return { type, payload } as SetMultipleSelectedEntities
		case 'SelectedDifferentEntity':
			if (!payload) throw new Error('Payload is required')
			return { type, payload }
		case 'AddEntitiesToMultipleSelected':
			if (!payload) throw new Error('Payload is required')
			return { type, payload }
		case 'RemoveEntitiesFromMultipleSelected':
			if (!payload) throw new Error('Payload is required')
			return { type, payload }
		case 'ClearSelectedState':
			return { type }
		case 'SetSelectedString':
			if (!payload) throw new Error('Payload is required')
			return { type, payload }
		case 'ClearStringSelected':
			return { type }
		case 'SelectedRollback':
			return { type }
		case 'SelectedStringRollbackToSingle':
			return { type }
		case 'SelectedStringRollbackToMultiple':
			return { type }
		default:
			throw new Error('Unknown event type')
	}
}

/*
 export const SELECTED_EVENT_V2 = <T extends SelectedEventTypes>(
 type: T,
 payload: SelectedEventPayloadOrNullByType<T>,
 ) => {
 return { type, payload }
 }

 type SelectedEventReturn<T extends SelectedEventTypes> = ReturnType<typeof SELECTED_EVENT<T>>
 const hi: SelectedEventReturn<'SelectedSingleEntity'> = {
 type: 'SelectedSingleEntity' /!*	payload: {
 ids: '1'
 }*!/,
 }
 */
