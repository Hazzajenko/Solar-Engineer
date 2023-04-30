// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
	'@@xstate/typegen': true
	internalEvents: {
		'xstate.init': { type: 'xstate.init' }
	}
	invokeSrcNameMap: {}
	missingImplementations: {
		actions: never
		delays: never
		guards: never
		services: never
	}
	eventsCausingActions: {
		AddEntitiesToMultipleSelected: 'AddEntitiesToMultipleSelected'
		ClearSelected: 'ClearSelectedState'
		ClearSelectedString: 'ClearStringSelected'
		PushSelectedHistory:
			| 'ClearSelectedState'
			| 'ClearStringSelected'
			| 'SetMultipleSelectedEntities'
			| 'SetSelectedString'
			| 'xstate.init'
		RemoveEntitiesFromMultipleSelected: 'RemoveEntitiesFromMultipleSelected'
		SetMultipleSelectedEntities: 'SetMultipleSelectedEntities'
		SetSelectedString: 'SetSelectedString'
	}
	eventsCausingDelays: {}
	eventsCausingGuards: {}
	eventsCausingServices: {}
	matchesStates:
		| 'EntitySelectedState'
		| 'EntitySelectedState.EntitiesSelected'
		| 'EntitySelectedState.NoneSelected'
		| 'StringSelectedState'
		| 'StringSelectedState.NoneSelected'
		| 'StringSelectedState.StringSelected'
		| {
				EntitySelectedState?: 'EntitiesSelected' | 'NoneSelected'
				StringSelectedState?: 'NoneSelected' | 'StringSelected'
		  }
	tags: never
}
