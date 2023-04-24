import { canvasAppMachine } from './client.machine'
import { XStateEvent } from './xstate-app-events.types'
import { interpret } from 'xstate'

const consoleLogTransition = () => {
	console.log('transition')
	// const state = canvasAppMachine.initialState;
	// const state = canvasAppMachine.snapshot;
	const state = canvasAppXStateService.getSnapshot()
	console.log(state.value)
	console.log(state.actions)
	console.log(state.context)
	console.log(state.event)
	console.log(state.history)
	const newState = canvasAppMachine.transition(state, state.event.type)
	console.log(newState.value)
	/*  const newState = canvasAppMachine.transition(state, 'Add Entity To Multiple Selected')

	 console.log(newState.actions)
	 console.log(newState.event)
	 console.log(newState.nextEvents)
	 console.log(newState.transitions)

	 console.log(newState)*/
}

export const canvasAppXStateService = interpret(canvasAppMachine, { devTools: true }).onTransition(
	(state) => {
		console.log(state.value)
		consoleLogTransition()
	},
)

// service.getSnapshot()

canvasAppXStateService.start()
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