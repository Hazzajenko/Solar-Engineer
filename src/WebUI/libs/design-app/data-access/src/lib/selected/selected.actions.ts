import { createActionGroup, emptyProps, props } from '@ngrx/store'

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
		'Clear Single Selected': emptyProps(),
		'Clear Multi Selected': emptyProps(),
		'Clear Selected State': emptyProps(),
		Noop: emptyProps(),
	},
})
