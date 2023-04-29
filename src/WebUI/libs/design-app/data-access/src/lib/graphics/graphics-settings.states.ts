import { CreatePreviewGraphicsState } from './create-preview'
import { Typegen0 } from './graphics-settings.machine.typegen'
import { NearbyGraphicsState } from './nearby-graphics'

export type GraphicsSettingsState = NearbyGraphicsState | CreatePreviewGraphicsState

export type GraphicsStateValue = {
	NearbyLinesState: NearbyGraphicsState
	CreatePreviewState: CreatePreviewGraphicsState
}

export type GraphicsStateMatches = Typegen0['matchesStates']