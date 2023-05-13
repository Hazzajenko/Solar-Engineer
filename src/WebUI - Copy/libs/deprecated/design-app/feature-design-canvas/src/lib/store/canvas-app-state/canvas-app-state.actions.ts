import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { Point } from '@shared/data-access/models'

export const CanvasAppStateActions = createActionGroup({
	source: 'Canvas App State Store',
	events: {
		'Set Hovering Entity Id': props<{
			hoveringEntityId: string | undefined
		}>(),
		'Set Selected Id': props<{
			selectedId: string | undefined
		}>(),
		'Set Selected Ids': props<{
			selectedIds: string[]
		}>(),
		'Add To Selected Ids': props<{
			selectedIds: string[]
		}>(),
		'Remove From Selected Ids': props<{
			selectedIds: string[]
		}>(),
		'Set Selected String Id': props<{
			selectedStringId: string | undefined
		}>(),
		'Set Rotating Entity Id': props<{
			rotatingEntityId: string | undefined
		}>(),
		'Set Rotating Entity Ids': props<{
			rotatingEntityIds: string[]
		}>(),
		'Set Dragging Entity Id': props<{
			draggingEntityId: string | undefined
		}>(),
		'Set Dragging Entity Location': props<{
			draggingEntityLocation: Point | undefined
		}>(),
		'Set Dragging Entity Ids': props<{
			draggingEntityIds: string[]
		}>(),
		'Clear State': emptyProps(),
	},
})
