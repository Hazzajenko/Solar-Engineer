import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthState } from './auth.reducer'

export const selectAuthState = createFeatureSelector<AuthState>('auth')
export const selectUser = createSelector(selectAuthState, (auth) => auth.user)
export const selectError = createSelector(selectAuthState, (auth) => auth.error)
export const isLoggedIn = createSelector(selectAuthState, (auth) => !!auth.user)
export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn)
