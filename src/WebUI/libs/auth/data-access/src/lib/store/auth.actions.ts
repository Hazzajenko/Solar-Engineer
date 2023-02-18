import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { AuthUserModel } from '@shared/data-access/models'

export const AuthActions = createActionGroup({
  source: 'Auth Store',
  events: {
    Login: emptyProps(),
    'Login With Google': emptyProps(),
    'Authorize Request': emptyProps(),
    'Login Success': props<{ user: AuthUserModel }>(),
    'Login Error': props<{ error: string | null }>(),
    'Modified User': props<{ user: AuthUserModel }>(),
    'Update User': props<{ update: Partial<AuthUserModel> }>(),
    'Add Error': props<{ error: string | null }>(),
    'Sign Out': emptyProps(),
  },
})
