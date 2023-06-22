import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AppUserModel, DeviceInfoModel } from '@shared/data-access/models'

export const AuthActions = createActionGroup({
	source: 'Auth Store',
	events: {
		Login: emptyProps(),
		'Sign In As Guest': emptyProps(),
		'Sign In With Google': emptyProps(),
		'Sign In With Microsoft': emptyProps(),
		'Sign In With Github': emptyProps(),
		'Is Returning User': emptyProps(),
		'Authorize Request': emptyProps(),
		'Sign In Success': props<{
			token: string
			user: AppUserModel
		}>(),
		'Initialize App': props<{
			token: string
			deviceInfo: DeviceInfoModel
		}>(),
		'Sign In Fetch User Success': props<{
			token: string
			user: AppUserModel
		}>(),
		'Sign In Error': props<{
			error: string | null
		}>(),
		'Get Token': emptyProps(),
		'Get Current User': emptyProps(),
		'Get Current User Success': props<{
			user: AppUserModel
		}>(),
		'Get Current User Error': props<{
			error: string | null
		}>(),
		'Login Success': props<{
			user: AppUserModel
		}>(),
		'Login Error': props<{
			error: string | null
		}>(),
		'Modified User': props<{
			user: AppUserModel
		}>(),
		'Update User': props<{
			update: Partial<AppUserModel>
		}>(),
		'Add Error': props<{
			error: string | null
		}>(),
		'Sign Out': emptyProps(),
	},
})
