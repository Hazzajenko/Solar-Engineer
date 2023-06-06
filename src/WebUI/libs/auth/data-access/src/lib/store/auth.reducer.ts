import { AuthActions } from './auth.actions'
import { Action, createReducer, on } from '@ngrx/store'
import { AppUserModel } from '@shared/data-access/models'

export interface AuthState {
	user?: AppUserModel
	guest: boolean
	error: string | null
}

export const AUTH_FEATURE_KEY = 'auth'
export const initialAuthState: AuthState = {
	user: undefined,
	guest: true,
	error: null,
}

export const reducer = createReducer(
	initialAuthState,

	on(AuthActions.signInAsGuest, (state) => ({
		...state,
		guest: true,
		user: undefined,
	})),

	on(AuthActions.signInSuccess, (state, { user }) => ({
		...state,
		user,
		guest: false,
	})),

	on(AuthActions.signInFetchUserSuccess, (state, { user }) => ({
		...state,
		user,
		guest: false,
	})),

	on(AuthActions.modifiedUser, (state, { user }) => ({
		...state,
		user,
	})),

	on(AuthActions.loginSuccess, (state, { user }) => ({
		...state,
		user,
		guest: false,
	})),

	on(AuthActions.loginError, (state, { error }) => ({
		...state,
		error,
	})),

	on(AuthActions.getCurrentUserSuccess, (state, { user }) => ({
		...state,
		user,
		guest: false,
	})),

	on(AuthActions.getCurrentUserError, (state, { error }) => ({
		...state,
		error,
	})),

	on(AuthActions.updateUser, (state, { update }) => ({
		...state,
		user: state.user
			? {
					...state.user,
					...update, // eslint-disable-next-line no-mixed-spaces-and-tabs
			  }
			: undefined,
	})),

	on(AuthActions.addError, (state, { error }) => ({
		...state,
		error,
	})),

	on(AuthActions.signOut, () => ({
		user: undefined,
		guest: true,
		error: null,
	})),
)

export function authReducer(state: AuthState | undefined, action: Action) {
	return reducer(state, action)
}
