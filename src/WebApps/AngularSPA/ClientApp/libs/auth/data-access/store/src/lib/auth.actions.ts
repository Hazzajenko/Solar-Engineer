import { SignInRequest, StorageModel } from '@auth/shared/models'
import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { ErrorModel, UserModel } from '@shared/data-access/models'
import { Update } from '@ngrx/entity'

export const AuthActions = createActionGroup({
  source: 'Auth Service',
  events: {
    Register: props<{ req: SignInRequest }>(),
    'Sign In': props<{ req: SignInRequest }>(),
    'Sign In Success': props<{ user: UserModel; token: string }>(),
    'Sign In Error': props<{ error: string | null }>(),
    'Sign In Errors': props<{ errors: ErrorModel[] }>(),
    'Sign In With LocalStorage': props<{ userInStorage: StorageModel }>(),
    'Sign In With LocalStorage Success': props<{ userInStorage: StorageModel }>(),
    'Sign In With LocalStorage Error': props<{ error: string | null }>(),
    'Modified User': props<{ user: UserModel }>(),
    'Add Token': props<{ token: string }>(),
    'Add User And Token': props<{ user: UserModel; token: string }>(),
    'Update User': props<{ update: Partial<UserModel> }>(),
    'Add Error': props<{ error: string | null }>(),
    'Sign Out': emptyProps(),
  },
})
