import { canvasAppMachine } from './client.machine';
import { XStateEvent } from './xstate-app-events.types';
import { AppStateValue } from './xstate-app.states';
import { getDifferenceInTwoObjects3, getNewStateFromTwoObjects } from '@shared/utils';
import { interpret } from 'xstate';


/*function xstateLogger<TContext, TEvents extends EventObject>(
 s: State<
 TContext,
 TEvents,
 any,
 {
 value: any
 context: TContext
 }
 >,
 ) {
 console.groupCollapsed('%c event', 'color: gray; font-weight: lighter;', s.event.type)
 console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', s.history)
 console.log('%c event', 'color: #03A9F4; font-weight: bold;', s.event)
 console.log('%c next state', 'color: #4CAF50; font-weight: bold;', s)
 console.groupEnd()
 }*/

export const stateDifferenceLogger = (state: any) => {
	const currentState = state.value as AppStateValue
	const historyState = state.history?.historyValue?.current as AppStateValue
	const stateDifference = historyState
		? getDifferenceInTwoObjects3(historyState, currentState)
		: null
	if (stateDifference) {
		if (!stateDifference[0].PointerState) {
			for (const key in stateDifference[0]) {
				if (Object.prototype.hasOwnProperty.call(stateDifference[0], key)) {
					const element = (stateDifference[0] as never)[key]
					console.log(
						'%c state',
						'color: #03A9F4; font-weight: bold;',
						`${key}: ${element} => ${(stateDifference[1] as never)[key]}`,
					)
				}
			}
		}
	}
}

export const stateEventLoggerExcludePointerState = (state: any) => {
	const currentState = state.value as AppStateValue
	const historyState = state.history?.historyValue?.current as AppStateValue
	const stateDifference = historyState
		? getNewStateFromTwoObjects(historyState, currentState)
		: null
	if (stateDifference && Object.keys(stateDifference).length > 0) {
		if (!stateDifference.PointerState) {
			console.log('%c event', 'color: #03A9F4; font-weight: bold;', stateDifference)
		}
		return
	}
	console.log('%c event', 'color: #03A9F4; font-weight: bold;', state.event)
}

// const stateLogger = new StaticLogger('state')

export const canvasAppXStateService = interpret(canvasAppMachine, { devTools: true }).onTransition(
	(state) => {
		// stateDifferenceLogger(state)
		stateEventLoggerExcludePointerState(state)
		// console.log('%c state', 'color: #03A9F4; font-weight: bold;', state.event)
	},
)

export type AppStateSnapshot = ReturnType<typeof canvasAppXStateService.getSnapshot>

// const asdas: AppStateSnapshot = canvasAppXStateService.getSnapshot()

// service.getSnapshot()

// canvasAppXStateService.start()
/*const send = canvasAppXStateService.send({
 type: 'AddEntitiesToMultipleSelected',
 payload: {
 ids: ['1'],
 },
 })*/

export const sendStateEvent = (event: XStateEvent) => canvasAppXStateService.send(event)

export const getState = () => canvasAppXStateService.getSnapshot()

/*export const matchWithState = (parentStateValue: any) => {
 return canvasAppXStateService.getSnapshot().matches('SelectedState.EntitySelected')
 }*/

export const getStateCtx = () => canvasAppXStateService.getSnapshot().context

export const getStateCtxSelected = () => canvasAppXStateService.getSnapshot().context.selected

export const getStateCtxSelectedSingleSelectedId = () =>
	canvasAppXStateService.getSnapshot().context.selected.singleSelectedId

export const getStateCtxSelectedMultipleSelectedIds = () =>
	canvasAppXStateService.getSnapshot().context.selected.multipleSelectedIds

export const getStateValue = () => canvasAppXStateService.getSnapshot().value

export const getStateEvent = () => canvasAppXStateService.getSnapshot().event

export const getStateActions = () => canvasAppXStateService.getSnapshot().actions

export const getStateHistory = () => canvasAppXStateService.getSnapshot().history

export const getStateNextEvents = () => canvasAppXStateService.getSnapshot().nextEvents

/*sendFn({
 type: 'AddEntitiesToMultipleSelected',
 payload: {
 ids:[ '1'],
 }
 })*/

/*
 export const sendToService = (event: any) => {
 canvasAppXStateService.send(event)
 }

 const machine = canvasAppMachine.withConfig({
 actions: {
 ClearSelected: (ctx) => {
 return (ctx.selected = InitialSelectedState)
 },
 SetSelectedEntity: (ctx, event) => {
 return (ctx.selected = {
 ...ctx.selected,
 singleSelectedId: event.payload.id,
 multipleSelectedIds: [],
 selectedStringId: undefined,
 })
 },
 },
 })*/