import {createReducer, on} from "@ngrx/store";
import {AuthStateActions} from "./auth.actions";
import {AuthState} from "./auth.state";



export const initialAuthState: AuthState = {
  user: undefined,
  token: undefined,
};

export const authReducer = createReducer(
  initialAuthState,

  on(AuthStateActions.signIn, (state, {user}) => ({
    user
  })),

  on(AuthStateActions.modifiedUser, (state, {user}) => ({
    user
  })),

  on(AuthStateActions.addToken, (state, {token}) => ({
    token
  })),

  on(AuthStateActions.addUserAndToken, (state, {user, token}) => ({
    user,
    token,
  })),

  on(AuthStateActions.signOut, (state, action) => ({
    user: undefined,
    token: undefined,
  })),
);
