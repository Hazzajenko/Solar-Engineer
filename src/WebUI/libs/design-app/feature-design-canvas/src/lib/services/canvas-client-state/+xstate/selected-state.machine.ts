import { InitialSelectedState, SelectedStateDeprecated } from '../types';
import { XStateSelectedEvent } from './selected';
// import { ActionByType } from './selected/machine-actions.types'
import { assign, createMachine, interpret } from 'xstate';


// graphicsSettingsMachine
/*inspect({
 iframe: false,
 url: 'https://statecharts.io/inspect',
 })*/

// inspect()
/*
 inspect({
 iframe: () => document.querySelector('iframe.some-xstate-iframe') as HTMLIFrameElement,
 })*/

// export type SelectedHistoryState = {}

// type events =

export type SelectedStateMachineState = Required<{
	EntitySelectedState?: 'EntitiesSelected' | 'NoneSelected'
	StringSelectedState?: 'NoneSelected' | 'StringSelected'
}>

/*const asdsadas: SelectedStateMachineState = {
 EntitySelectedState: 'EntitiesSelected',
 StringSelectedState: 'NoneSelected',
 }*/

export type SelectedStateMachineContext = SelectedStateDeprecated & {
	selectedHistoryCtx: SelectedStateDeprecated[]
	selectedHistoryState: SelectedStateMachineState[]
}
export const selectedStateMachine = createMachine(
	{
		/** @xstate-layout N4IgpgJg5mDOIC5QGECGA7Abq2BBADvgHQDKYANmAMYAukABCTanQMRrpUWMXV0QBtAAwBdRKHwB7WAEsaMyenEgAHogDsAJgA0IAJ6IAzAE4hRACybjANgAc6gKwBfJ7o7Y8hUr1oMmLMCIAUXR5Gj0eSl8IdnIZKgBreiDyWDAAdwALMAAnMGExJBApWXlFZTUEEwciIWNDR10DBE1zayJjB0MARk1nVxB3HAJiMij+RmY6YNC5CLG+SFj4hIYAeXR6ABEZADNd3LBQ5NnwguUSuQUlIsru83MiRv1EbutuonvDTSs363--sYXG4MB4Rt5xn4poEAHKKMCRRYxZBxRL0DYnMJ6c5FS5lG6gSrVWr1Z7NboObrAwag4ZeBbRSYBIhw9AIhn8Vj+HI0RG0a70ABCkhUOIk0iu5VuGgcZks3XsDiaiD66iIXWs5gctkMur1DWpQ08ox8E380w5DGFKiZPPoAAVJDJjmQaFzTQwALIAV3I8nwlExVzgYuKEvxFVerXalIc1j6ypalI6XV6-RBWDpJshECZFo9uettt5judvNd7vGAqLHC45EoglEF3D10jCEccs0CrJr3e6p1+sHhnMhtpxohSLzgR9fpkAYRITCMjgfM5uAgucXc3oABVJPQZ-7A5bG4VxaVW9KEPdTBYu4rEwqPuZ1NY430XAN0JIIHBlEaRmbC8pUJRAAFpWkTCCRwGAD6QLKcgMlAlVBVcxE2sQx1VHTNxxPKcZixVdICQiMr27DorDsHsWnjElMIccw-gBdQcLBeCcwI1l2QLUjL1AhBtRqBolReFotCIax1BsRU2KzCdGXNQJ8KLbkSydF0wBoPiQNQhBjFsWx1XUWw00TTRHE+aTqPTGlcPBfClKIQ850DLd5BXE8dJQu5KSw951G7UTmk0WxNDvGTHE-JwgA */
		tsTypes: {} as import('./selected-state.machine.typegen').Typegen0,
		type: 'parallel',
		schema: {
			context: {} as SelectedStateMachineContext,
			events: {} as XStateSelectedEvent,
		},
		id: 'SelectedState',
		context: {
			...InitialSelectedState,
			selectedHistoryCtx: [],
			selectedHistoryState: [],
		},

		/*		on: {
	 ClearSelectedState: {
	 target: '.NoneSelected',
	 actions: 'ClearSelected',
	 },
	 },*/
		states: {
			EntitySelectedState: {
				initial: 'NoneSelected',
				states: {
					NoneSelected: {
						entry: 'PushSelectedHistory',
						on: {
							SetMultipleSelectedEntities: {
								target: 'EntitiesSelected',
								actions: ['SetMultipleSelectedEntities'],
							},
						},
					},
					EntitiesSelected: {
						entry: 'PushSelectedHistory',
						on: {
							AddEntitiesToMultipleSelected: {
								actions: 'AddEntitiesToMultipleSelected',
							},
							SetMultipleSelectedEntities: {
								target: 'EntitiesSelected',
								actions: ['SetMultipleSelectedEntities'],
							},
							RemoveEntitiesFromMultipleSelected: {
								actions: 'RemoveEntitiesFromMultipleSelected',
							},
							ClearSelectedState: {
								target: 'NoneSelected',
								actions: 'ClearSelected',
							},
						},
					},
				},
			},
			StringSelectedState: {
				initial: 'NoneSelected',
				states: {
					NoneSelected: {
						entry: 'PushSelectedHistory',
						on: {
							SetSelectedString: {
								target: 'StringSelected',
								actions: 'SetSelectedString',
							},
						},
					},
					StringSelected: {
						entry: 'PushSelectedHistory',
						on: {
							SetSelectedString: {
								target: 'StringSelected',
								actions: 'SetSelectedString',
							},
							ClearStringSelected: {
								target: 'NoneSelected',
								actions: 'ClearSelectedString',
							},
							ClearSelectedState: {
								target: 'NoneSelected',
								actions: 'ClearSelected',
							},
						},
					},
				},
			},
		},
		predictableActionArguments: true,
		preserveActionOrder: true,
	},
	{
		actions: {
			/*			PushSelectedHistory: assign({
		 selectedHistoryCtx: (ctx, event) => {
		 ctx.selectedHistoryCtx.push(ctx)
		 return ctx.selectedHistoryCtx
		 },
		 selectedHistoryState: (ctx, event) => {
		 ctx.selectedHistoryState.push(event.type)
		 return ctx.selectedHistoryState
		 }
		 ),*/
			PushSelectedHistory: (ctx, _, idk) => {
				console.log('PushSelectedHistory', idk)
				if (!idk.state) return
				if (!('value' in idk.state)) return
				const stateValue = idk.state.value as SelectedStateMachineState
				ctx.selectedHistoryCtx.push(ctx)
				ctx.selectedHistoryState.push(stateValue)
			},

			/**
			 * Selected State Actions
			 */
			ClearSelected: (ctx) => {
				return (ctx = {
					...InitialSelectedState,
					selectedHistoryCtx: ctx.selectedHistoryCtx,
					selectedHistoryState: ctx.selectedHistoryState,
				})
			} /*			SetSelectedEntity: (ctx, event) => {
		 return (ctx = {
		 ...ctx,
		 singleSelectedId: event.payload.id,
		 multipleSelectedIds: [],
		 selectedStringId: undefined,
		 })
		 },*/ /*			SetMultipleSelectedEntities: (ctx, event) => {
		 const ids = event.payload.ids
		 /!*				if (ctx.singleSelectedId) {
		 return (ctx = {
		 ...ctx,
		 multipleSelectedIds: [ctx.singleSelectedId, ...ids], // selectionBoxBounds: event.payload.selectionBoxBounds,
		 singleSelectedId: undefined,
		 })
		 }*!/
		 return (ctx = {
		 ...ctx,
		 multipleSelectedIds: ids, // selectionBoxBounds: event.payload.selectionBoxBounds,
		 // singleSelectedId: undefined,
		 })
		 },*/,
			SetMultipleSelectedEntities: assign({
				multipleSelectedIds: (_, event) => event.payload.ids,
			}),
			AddEntitiesToMultipleSelected: assign({
				multipleSelectedIds: (ctx, event) => [...ctx.multipleSelectedIds, ...event.payload.ids],
			}),
			RemoveEntitiesFromMultipleSelected: assign({
				multipleSelectedIds: (ctx, { payload }) =>
					ctx.multipleSelectedIds.filter((id) => !payload.ids.includes(id)),
			}),

			/*			RemoveEntitiesFromMultipleSelected: (ctx, { payload }) => {
		 return (ctx = {
		 ...ctx,
		 multipleSelectedIds: ctx.multipleSelectedIds.filter((id) => !payload.ids.includes(id)),
		 })
		 },*/

			SetSelectedString: assign({
				selectedStringId: (_, event) => event.payload.stringId,
			}),

			ClearSelectedString: assign({
				selectedStringId: undefined,
			}),

			/*			SetSelectedString: (ctx, event) => {
		 return (ctx = {
		 ...ctx,
		 selectedStringId: event.payload.stringId,
		 })
		 },

		 ClearSelectedString: (ctx) => {
		 return (ctx = {
		 ...ctx,
		 selectedStringId: undefined,
		 })
		 },*/

			/*			/!**
		 * Canvas Actions
		 *!/
		 RenderCanvas: () => {
		 /!*		return (ctx = {
		 ...ctx,
		 })*!/
		 throw new Error('Method not implemented.')
		 },*/
		},
	},
)

const getSnapshot = interpret(selectedStateMachine).getSnapshot

export type SelectedStateSnapshot = ReturnType<typeof getSnapshot>

/*
 export const selectedStateInterpreter = interpret(selectedStateMachine, {
 devTools: true,
 }).onTransition((state) => {
 stateEventLoggerExcludePointerState(state)
 })*/