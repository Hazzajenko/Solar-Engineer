import { CreatePreviewGraphicsEvent } from './create-preview'
import { Typegen0 } from './graphics-state.machine.typegen'
import { NearbyGraphicsEvent } from './nearby-graphics'

export type GraphicsStateEvent = NearbyGraphicsEvent | CreatePreviewGraphicsEvent

export type GraphicsStateMatches = Typegen0['matchesStates']
export type GraphicsStateMatchesModel = {
	CreatePreviewState?: 'CreatePreviewDisabled' | 'CreatePreviewEnabled'
	NearbyLinesState?:
		| 'NearbyLinesDisabled'
		| 'NearbyLinesEnabled'
		| {
				NearbyLinesEnabled?:
					| 'CenterLineBetweenTwoEntities'
					| 'CenterLineScreenSize'
					| 'TwoSideAxisLines'
		  }
}