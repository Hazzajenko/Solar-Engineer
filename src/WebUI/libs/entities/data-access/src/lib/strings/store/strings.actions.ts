import { UpdateStr } from '@ngrx/entity/src/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { StringModel } from '@entities/shared'

export const StringsActions = createActionGroup({
	source: 'Strings Store',
	events: {
		'Add String': props<{
			string: StringModel
		}>(),
		'Add Many Strings': props<{
			strings: StringModel[]
		}>(),
		'Update String': props<{
			update: UpdateStr<StringModel>
		}>(),
		'Update Many Strings': props<{
			updates: UpdateStr<StringModel>[]
		}>(),
		'Delete String': props<{
			stringId: string
		}>(),
		'Delete Many Strings': props<{
			stringIds: string[]
		}>(),
		'Clear Strings State': emptyProps(),
	},
})
