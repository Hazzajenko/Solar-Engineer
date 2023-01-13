import { Action, createReducer, on } from '@ngrx/store'
import { ErrorModel, UserModel } from '@shared/data-access/models'
import { AuthActions } from './auth.actions'

export interface AuthState {
  user?: UserModel
  token?: string
  error: string | null
  errors?: ErrorModel[]
}

export const AUTH_FEATURE_KEY = 'auth'
export const initialAuthState: AuthState = {
  user: undefined,
  token: undefined,
  error: null,
  errors: undefined,
}

export const reducer = createReducer(
  initialAuthState,

  on(AuthActions.modifiedUser, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.addToken, (state, { token }) => ({
    ...state,
    token,
  })),

  on(AuthActions.signInSuccess, (state, { user, token }) => ({
    ...state,
    user,
    token,
  })),

  on(AuthActions.signInError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(AuthActions.signInErrors, (state, { errors }) => ({
    ...state,
    errors,
  })),

  on(AuthActions.addUserAndToken, (state, { user, token }) => ({
    ...state,
    user,
    token,
  })),

  on(AuthActions.signOut, () => ({
    user: undefined,
    token: undefined,
    error: null,
  })),
)


export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action)
}
