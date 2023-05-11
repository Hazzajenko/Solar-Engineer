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

export const allSelectedActions = Object.keys(SelectedActions).map(
	(key) => SelectedActions[key as keyof typeof SelectedActions],
)

export type ActionGroup = ReturnType<typeof createActionGroup>

export const getAllActions = (actionGroup: ActionGroup) => {
	return Object.keys(actionGroup).map((key) => actionGroup[key as keyof typeof actionGroup])
}

// export type SelectedActions = typeof SelectedActions
/*export type SelectedActions = typeof SelectedActions

 type SelectedActionsType = SelectedActions[keyof SelectedActions]
 type SelectedActionsEvents = SelectedActionsType['type']

 export type SelectedActionsPayload = {
 [K in SelectedActionsEvents]: Extract<SelectedActionsType, { type: K }>['payload']
 }*/
// const allSelectedActions = SelectedActions['']
