import { CreatePreviewGraphicsState } from './create-preview'
import { Typegen0 } from './graphics-settings.machine.typegen'
import { NEARBY_LINES_STATE_KEY, NearbyGraphicsState } from './nearby-graphics'

export type GraphicsSettingsState = NearbyGraphicsState | CreatePreviewGraphicsState

export type GraphicsStateValue = {
	NearbyLinesState: NearbyGraphicsState
	CreatePreviewState: CreatePreviewGraphicsState
}
// NearbyLinesState: NearbyGraphicsState
const sadasdas: GraphicsStateValue = {
	[NEARBY_LINES_STATE_KEY]: {
		NearbyLinesEnabled: 'CenterLineBetweenTwoEntities',
	},
	CreatePreviewState: 'CreatePreviewDisabled',
}

const asdsa: GraphicsSettingsState = {
	NearbyLinesEnabled: 'CenterLineBetweenTwoEntities',
}

export type GraphicsStateMatches = Typegen0['matchesStates']

// type GraphicsStateMatches2 =

// const hello: GraphicsStateMatches = 'NearbyLinesState.NearbyLinesDisabled'
