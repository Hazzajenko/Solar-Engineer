import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AuthUserModel } from '@shared/data-access/models'

export const AuthActions = createActionGroup({
	source: 'Auth Store',
	events: {
		Login: emptyProps(),
		'Sign In With Google': emptyProps(),
		'Is Returning User': emptyProps(),
		'Authorize Request': emptyProps(),
		'Sign In Success': props<{
			token: string
			user: AuthUserModel
		}>(),
		'Sign In Fetch User Success': props<{
			token: string
			user: AuthUserModel
		}>(),
		'Sign In Error': props<{
			error: string | null
		}>(),
		'Get Token': emptyProps(),
		'Get Current User': emptyProps(),
		'Get Current User Success': props<{
			user: AuthUserModel
		}>(),
		'Get Current User Error': props<{
			error: string | null
		}>(),
		'Login Success': props<{
			user: AuthUserModel
		}>(),
		'Login Error': props<{
			error: string | null
		}>(),
		'Modified User': props<{
			user: AuthUserModel
		}>(),
		'Update User': props<{
			update: Partial<AuthUserModel>
		}>(),
		'Add Error': props<{
			error: string | null
		}>(),
		'Sign Out': emptyProps(),
	},
})
