import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import {
	PanelId,
	PanelLinkFromMenu,
	PanelLinkId,
	PanelLinkModel,
	PanelLinkRequest,
	PanelSymbol,
	StringCircuitWithIndex,
} from '@entities/shared'

export const PanelLinksActions = createActionGroup({
	source: 'PanelLinks Store',
	events: {
		'Load Local Storage Panel Links': props<{
			panelLinks: PanelLinkModel[]
		}>(),
		'Load Panel Links': props<{
			panelLinks: PanelLinkModel[]
		}>(),
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
			panelLinkId: PanelLinkId
		}>(),
		'Delete Many Panel Links': props<{
			panelLinkIds: PanelLinkId[]
		}>(),
		'Set Hovering Over Panel In Link Menu Id': props<{
			panelId: PanelId
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
			panelLinkId: PanelLinkId
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
		'Add Panel Link No Signalr': props<{
			panelLink: PanelLinkModel
		}>(),
		'Add Many Panel Links No Signalr': props<{
			panelLinks: PanelLinkModel[]
		}>(),
		'Update Panel Link No Signalr': props<{
			update: UpdateStr<PanelLinkModel>
		}>(),
		'Update Many Panel Links No Signalr': props<{
			updates: UpdateStr<PanelLinkModel>[]
		}>(),
		'Delete Panel Link No Signalr': props<{
			panelLinkId: PanelLinkId
		}>(),
		'Delete Many Panel Links No Signalr': props<{
			panelLinkIds: PanelLinkId[]
		}>(),
		'Clear Panel Links State': emptyProps(),
		Noop: emptyProps(),
	},
})
