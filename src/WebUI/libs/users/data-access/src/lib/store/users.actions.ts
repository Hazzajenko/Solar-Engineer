import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { WebUserModel } from '@users/shared'
import { EntityUpdate } from '@shared/data-access/models'

export const UsersActions = createActionGroup({
	source: 'Users Store',
	events: {
		'Load Users': props<{
			users: WebUserModel[]
		}>(),
		'Add User': props<{
			user: WebUserModel
		}>(),
		'Add Many Users': props<{
			users: WebUserModel[]
		}>(),
		'Update User': props<{
			update: UpdateStr<WebUserModel>
		}>(),
		'Update Many Users': props<{
			updates: UpdateStr<WebUserModel>[]
		}>(),
		'Update Many Users With String': props<{
			updates: EntityUpdate<WebUserModel>[]
		}>(),
		'Delete User': props<{
			userId: WebUserModel['id']
		}>(),
		'Delete Many Users': props<{
			userIds: WebUserModel['id'][]
		}>(),
		'Add User No Signalr': props<{
			user: WebUserModel
		}>(),
		'Add Many Users No Signalr': props<{
			users: WebUserModel[]
		}>(),
		'Update User No Signalr': props<{
			update: UpdateStr<WebUserModel>
		}>(),
		'Update Many Users No Signalr': props<{
			updates: UpdateStr<WebUserModel>[]
		}>(),
		'Delete User No Signalr': props<{
			userId: WebUserModel['id']
		}>(),
		'Delete Many Users No Signalr': props<{
			userIds: WebUserModel['id'][]
		}>(),
		'Clear Users State': emptyProps(),
		Noop: emptyProps(),
	},
})
