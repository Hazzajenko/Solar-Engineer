import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	ClosedCircuitChain,
	OpenCircuitChain,
	PanelId,
	PanelLinkFromMenu,
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
} from '@entities/shared'
import { CurvedNumberLine } from '@canvas/shared'

export const PanelLinksActions = createActionGroup({
	source: 'PanelLinks Store',
	events: {
		'Start Panel Link': props<{
			panelLinkRequest: PanelLinkRequest
		}>(),
		'End Panel Link': emptyProps(),
		'Add Panel Link': props<{
			panelLink: PanelLinkModel
		}>(),
		'Add Many Panel Links': props<{
			panelLinks: PanelLinkModel[]
		}>(),
		'Update Panel Link': props<{
			update: UpdateStr<PanelLinkModel>
		}>(),
		'Update Many Panel Links': props<{
			updates: UpdateStr<PanelLinkModel>[]
		}>(),
		'Delete Panel Link': props<{
			panelLinkId: string
		}>(),
		'Delete Many Panel Links': props<{
			panelLinkIds: string[]
		}>(),
		'Set Hovering Over Panel In Link Menu Id': props<{
			panelId: string
		}>(),
		'Clear Hovering Over Panel In Link Menu Id': emptyProps(),
		'Set Hovering Over Panel Link In Link Menu': props<{
			hoveringOverPanelLink: PanelLinkFromMenu
		}>(),
		'Clear Hovering Over Panel Link In Link Menu': emptyProps(),
		'Selected String Link Lines Updated': emptyProps(),
		'Set Selected String Link Circuit': props<{
			selectedStringCircuit: {
				openCircuitChains: OpenCircuitChain[]
				closedCircuitChains: ClosedCircuitChain[]
				circuitCurvedLines: CurvedNumberLine[][]
				circuitLinkLineTuples: [PanelLinkId, CurvedNumberLine][][]
			}
		}>(),
		'Clear Selected String Link Circuit': emptyProps(),
		'Set Hovering Over Panel Link In App': props<{
			panelLinkId: string
		}>(),
		'Clear Hovering Over Panel Link In App': emptyProps(),
		'Set Hovering Over Panel Polarity Symbol': props<{
			panelId: PanelId
			symbol: 'positive' | 'negative'
		}>(),
		'Clear Hovering Over Panel Polarity Symbol': emptyProps(),
		'Set Mouse Down On Panel Polarity Symbol': props<{
			panelId: PanelId
			symbol: 'positive' | 'negative'
		}>(),
		'Clear Mouse Down On Panel Polarity Symbol': emptyProps(),
		'Clear Panel Links State': emptyProps(),
		Noop: emptyProps(),
	},
})
