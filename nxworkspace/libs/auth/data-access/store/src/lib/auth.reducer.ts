import { Action, createReducer, on } from '@ngrx/store'
import { AuthActions } from './auth.actions'
import { AuthState } from './auth.state'


export const AUTH_FEATURE_KEY = 'auth'
export const initialAuthState: AuthState = {
  user: undefined,
  token: undefined,
}

export const reducer = createReducer(
  initialAuthState,

  on(AuthActions.modifiedUser, (state, { user }) => ({
    user,
  })),

  on(AuthActions.addToken, (state, { token }) => ({
    token,
  })),

  on(AuthActions.signInSuccess, (state, { user, token }) => ({
    user,
    token,
  })),

  on(AuthActions.addUserAndToken, (state, { user, token }) => ({
    user,
    token,
  })),

  on(AuthActions.signOut, () => ({
    user: undefined,
    token: undefined,
  })),
)


export function authReducer(state: AuthState | undefined, action: Action) {
  return reducer(state, action)
}
