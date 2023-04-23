import { canvasAppMachine } from './client.machine'
import { interpret } from 'xstate'

const consoleLogTransition = () => {
  console.log('transition')
  // const state = canvasAppMachine.initialState;
  // const state = canvasAppMachine.snapshot;
  const state = canvasAppXStateService.getSnapshot()
  const newState = canvasAppMachine.transition(state, 'Add Entity To Multiple Selected')

  console.log(newState.actions)
  console.log(newState.event)
  console.log(newState.nextEvents)
  console.log(newState.transitions)

  console.log(newState)
}

export const canvasAppXStateService = interpret(canvasAppMachine).onTransition((state) => {
  console.log(state.value)
  consoleLogTransition()
})

// service.getSnapshot()

canvasAppXStateService.start()

export const sendToService = (event: any) => {
  canvasAppXStateService.send(event)
}