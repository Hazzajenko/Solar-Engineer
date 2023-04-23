import { canvasAppMachine } from './client.machine'
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

export const sendToService = (event: any) => {
  canvasAppXStateService.send(event)
}