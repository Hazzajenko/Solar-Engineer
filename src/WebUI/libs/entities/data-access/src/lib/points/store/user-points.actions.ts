import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UserPoint } from '@entities/shared'

export const UserPointsActions = createActionGroup({
	source: 'UserPoints Store',
	events: {
		'Add UserPoint': props<{
			userPoint: UserPoint
		}>(),
		'Add Many UserPoints': props<{
			userPoints: UserPoint[]
		}>(),
		'Update UserPoint': props<{
			update: UpdateStr<UserPoint>
		}>(),
		'Update Many UserPoints': props<{
			updates: UpdateStr<UserPoint>[]
		}>(),
		'Delete UserPoint': props<{
			userPointId: UserPoint['id']
		}>(),
		'Delete Many UserPoints': props<{
			userPointIds: UserPoint['id'][]
		}>(),
		'Clear UserPoints State': emptyProps(),
		Noop: emptyProps(),
	},
})
