import { stateEventLoggerExcludePointerState } from '../../../../../services';
import { graphicsSettingsMachine } from './graphics-settings.machine';
import { NearbyGraphicsState } from './nearby-graphics';
import { interpret } from 'xstate';


// export type NearbyGraphicsEventType = NearbyGraphicsEvent['type']

export type GraphicsSettingsStateValue = {
	NearbyLinesState: NearbyGraphicsState
	// NearbyLinesState: NearbyGraphicsEventType
}

/*const sdfsa: GraphicsSettingsStateValue = {
 NearbyLinesState: 'CenterLineBetweenTwoEntities',
 }*/
export const graphicsSettingsInterpreter = interpret(graphicsSettingsMachine, {
	devTools: true,
}).onTransition((state) => {
	stateEventLoggerExcludePointerState(state)
})

export type GraphicsStateSnapshot = ReturnType<typeof graphicsSettingsInterpreter.getSnapshot>
// .start()

// graphicsSettingsInterpreter.getSnapshot().matches('NearbyLinesState.NearbyLinesEnabled.CenterLineBetweenTwoEntities')

/*type matchesStates = Typegen0['matchesStates']

 const hello: matchesStates = 'NearbyLinesState.NearbyLinesDisabled'*/
/*
 const hello: Typegen0 = {
 matchesStates: 'NearbyLinesState.NearbyLinesDisabled'
 }*/