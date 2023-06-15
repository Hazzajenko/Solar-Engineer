import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AppUserConnectionModel } from '@auth/shared'

export const ConnectionsActions = createActionGroup({
	source: 'Connections Store',
	events: {
		'Load Connections': props<{
			connections: AppUserConnectionModel[]
		}>(),
		'Add Connection': props<{
			connection: AppUserConnectionModel
		}>(),
		'Add Many Connections': props<{
			connections: AppUserConnectionModel[]
		}>(),
		'Update Connection': props<{
			update: UpdateStr<AppUserConnectionModel>
		}>(),
		'Update Many Connections': props<{
			updates: UpdateStr<AppUserConnectionModel>[]
		}>(),
		'Delete Connection': props<{
			appUserId: AppUserConnectionModel['appUserId']
		}>(),
		'Clear Connections State': emptyProps(),
		Noop: emptyProps(),
	},
})
