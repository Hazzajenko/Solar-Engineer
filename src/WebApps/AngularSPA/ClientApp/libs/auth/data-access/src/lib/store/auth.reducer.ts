import { Action, createReducer, on } from '@ngrx/store'
import { AuthUserModel } from '@shared/data-access/models'
import { AuthActions } from './auth.actions'

export interface AuthState {
  user?: AuthUserModel
  error: string | null
}

export const AUTH_FEATURE_KEY = 'auth'
export const initialAuthState: AuthState = {
  user: undefined,
  error: null,
}

export const reducer = createReducer(
  initialAuthState,

  on(AuthActions.modifiedUser, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.loginError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AuthActions.updateUser, (state, { update }) => ({
    ...state,
    user: state.user
      ? {
          ...state.user,
          ...update,
        }
      : undefined,
  })),

  on(AuthActions.addError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AuthActions.signOut, () => ({
    user: undefined,
    error: null,
  })),
)

export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action)
}
