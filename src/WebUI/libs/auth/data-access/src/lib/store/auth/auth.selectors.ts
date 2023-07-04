import { AuthState } from './auth.reducer'
import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AppUserModel } from '@shared/data-access/models'

export const selectAuthState = createFeatureSelector<AuthState>('auth')
export const selectUser = createSelector(selectAuthState, (auth) => auth.user)

export const selectSignInTime = createSelector(selectAuthState, (auth) => auth.signInTime)

export const selectUserIdAndSignInTime = createSelector(
	selectUser,
	selectSignInTime,
	(user: AppUserModel | undefined, signInTime: Date | undefined) => {
		if (!user || !signInTime) return undefined
		return {
			userId: user.id,
			signInTime,
		}
	},
)

// export const selectError = createSelector(selectAuthState, (auth) => auth.error)
// export const isLoggedIn = createSelector(selectAuthState, (auth) => !!auth.user)
// export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn)
