import {UserModel} from '@shared/models'
import {createActionGroup, emptyProps, props} from "@ngrx/store";

export const AuthStateActions = createActionGroup({
  source: 'Auth Service',
  events: {
    'Sign In': props<{ user: UserModel }>(),
    'Modified User': props<{ user: UserModel }>(),
    'Add Token': props<{ token: string }>(),
    'Add User And Token': props<{ user: UserModel, token: string }>(),
    'Sign Out': emptyProps(),
  },
})
