import { graphicsStateMachine } from './graphics-state.machine'
import { NearbyGraphicsState } from './nearby-graphics'
import { xstateLogger } from '@design-app/utils'
import { interpret } from 'xstate'

export type GraphicsSettingsStateValue = {
	NearbyLinesState: NearbyGraphicsState
	// NearbyLinesState: NearbyGraphicsEventType
}

export const graphicsSettingsInterpreter = interpret(graphicsStateMachine, {
	devTools: true,
}).onTransition((state) => {
	xstateLogger(state)
})
export type GraphicsXStateSnapshot = ReturnType<typeof graphicsSettingsInterpreter.getSnapshot>