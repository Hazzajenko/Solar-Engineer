import { SignInRequest } from '@auth/shared/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { UserModel } from '@shared/data-access/models'

export const AuthActions = createActionGroup({
  source: 'Auth Service',
  events: {
    'Sign In': props<{ req: SignInRequest }>(),
    'Sign In Success': props<{ user: UserModel; token: string }>(),
    'Sign In Error': props<{ error: string | null }>(),
    'Modified User': props<{ user: UserModel }>(),
    'Add Token': props<{ token: string }>(),
    'Add User And Token': props<{ user: UserModel; token: string }>(),
    'Sign Out': emptyProps(),
  },
})
