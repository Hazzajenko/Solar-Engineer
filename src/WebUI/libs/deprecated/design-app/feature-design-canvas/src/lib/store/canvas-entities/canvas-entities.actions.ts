import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { CanvasEntity } from 'deprecated/design-app/feature-design-canvas'

export const CanvasEntitiesActions = createActionGroup({
	source: 'Canvas Entities Store',
	events: {
		'Add Entity': props<{
			entity: CanvasEntity
		}>(),
		'Add Many Entities': props<{
			entities: CanvasEntity[]
		}>(),
		'Update Entity': props<{
			update: UpdateStr<CanvasEntity>
		}>(),
		'Update Many Entities': props<{
			updates: UpdateStr<CanvasEntity>[]
		}>(),
		'Set Entity Rotation': props<{
			entityId: string
			angle: number
		}>(),
		'Rotate Entity': props<{
			entityId: string
			rotateBy: number
		}>(),
		'Delete Entity': props<{
			entityId: string
		}>(),
		'Delete Many Entities': props<{
			entityIds: string[]
		}>(),
		'Clear Canvas Entities State': emptyProps(),
	},
})
