import { createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { UserModel } from "../user.model";

export interface AuthState {
	user?: UserModel;
	token?: string;
}

export const initialAuthState: AuthState = {
	user: undefined,
	token: undefined,
};

export const authReducer = createReducer(
	initialAuthState,

	on(AuthActions.signIn, (state, action) => ({
		user: action.user,
	})),

	on(AuthActions.modifiedUser, (state, action) => ({
		user: action.user,
	})),

	on(AuthActions.addToken, (state, action) => ({
		token: action.token,
	})),

	on(AuthActions.addUserAndToken, (state, action) => ({
		user: action.user,
		token: action.token,
	})),

	on(AuthActions.signOut, (state, action) => ({
		user: undefined,
		token: undefined,
	})),
);
