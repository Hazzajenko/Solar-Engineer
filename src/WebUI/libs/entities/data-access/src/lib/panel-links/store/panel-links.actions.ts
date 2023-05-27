import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	PanelId,
	PanelLinkFromMenu,
	PanelLinkModel,
	PanelLinkRequest,
	PanelSymbol,
	StringCircuitWithIndex,
} from '@entities/shared'

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
		'Set Selected String Circuit': props<{
			selectedStringCircuit: StringCircuitWithIndex
		}>(),
		'Clear Selected String Circuit': emptyProps(),
		'Set Hovering Over Panel Link In App': props<{
			panelLinkId: string
		}>(),
		'Clear Hovering Over Panel Link In App': emptyProps(),
		'Set Hovering Over Panel Polarity Symbol': props<{
			panelSymbol: PanelSymbol
		}>(),
		'Clear Hovering Over Panel Polarity Symbol': emptyProps(),
		'Set Mouse Down On Panel Polarity Symbol': props<{
			panelSymbol: PanelSymbol
		}>(),
		'Clear Mouse Down On Panel Polarity Symbol': emptyProps(),
		'Set Drawing Panel Polarity Symbol Line': props<{
			panelSymbol: PanelSymbol
		}>(),
		'Clear Drawing Panel Polarity Symbol Line': emptyProps(),
		'Set Selected Link Mode Panel Id': props<{
			panelId: PanelId
		}>(),
		'Clear Selected Link Mode Panel Id': emptyProps(),
		'Clear Panel Links State': emptyProps(),
		Noop: emptyProps(),
	},
})
