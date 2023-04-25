import { CreatePreviewGraphicsState } from './create-preview'
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