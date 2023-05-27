import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelId, PanelLinkId, StringId } from '@entities/shared'

export const SelectedActions = createActionGroup({
	source: 'Selected Store',
	events: {
		'Select Panel': props<{
			panelId: PanelId
		}>(),
		'Select Multiple Panels': props<{
			panelIds: PanelId[]
		}>(),
		'Select String': props<{
			stringId: StringId
		}>(),
		'Clear Selected String': emptyProps(),
		'Start Panel MultiSelect': props<{
			panelId: PanelId
		}>(),
		'Add Panels To MultiSelect': props<{
			panelIds: PanelId[]
		}>(),
		'Remove Panels From MultiSelect': props<{
			panelIds: PanelId[]
		}>(),
		'Select Panel Link': props<{
			panelLinkId: PanelLinkId
		}>(),
		'Clear Selected Panel Link': emptyProps(),
		'Clear Single Selected': emptyProps(),
		'Clear Multi Selected': emptyProps(),
		'Clear Selected State': emptyProps(),
		Noop: emptyProps(),
	},
})

export const allSelectedActions = Object.keys(SelectedActions).map(
	(key) => SelectedActions[key as keyof typeof SelectedActions],
)

// export type SelectedActions = typeof SelectedActions
/*export type SelectedActions = typeof SelectedActions

 type SelectedActionsType = SelectedActions[keyof SelectedActions]
 type SelectedActionsEvents = SelectedActionsType['type']

 export type SelectedActionsPayload = {
 [K in SelectedActionsEvents]: Extract<SelectedActionsType, { type: K }>['payload']
 }*/
// const allSelectedActions = SelectedActions['']
