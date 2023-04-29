import { graphicsSettingsMachine } from './graphics-settings.machine'
import { NearbyGraphicsState } from './nearby-graphics'
import { xstateLogger } from '@design-app/utils'
import { interpret } from 'xstate'

export type GraphicsSettingsStateValue = {
	NearbyLinesState: NearbyGraphicsState
	// NearbyLinesState: NearbyGraphicsEventType
}

export const graphicsSettingsInterpreter = interpret(graphicsSettingsMachine, {
	devTools: true,
}).onTransition((state) => {
	xstateLogger(state)
})
export type GraphicsStateSnapshot = ReturnType<typeof graphicsSettingsInterpreter.getSnapshot>