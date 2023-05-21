import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { PanelLinkId } from '@entities/shared'

export const SelectedActions = createActionGroup({
	source: 'Selected Store',
	events: {
		'Select Entity': props<{
			entityId: string
		}>(),
		'Select Multiple Entities': props<{
			entityIds: string[]
		}>(),
		'Select String': props<{
			stringId: string
		}>(),
		'Clear Selected String': emptyProps(),
		'Start MultiSelect': props<{
			entityId: string
		}>(),
		'Add Entities To MultiSelect': props<{
			entityIds: string[]
		}>(),
		'Remove Entities From MultiSelect': props<{
			entityIds: string[]
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
