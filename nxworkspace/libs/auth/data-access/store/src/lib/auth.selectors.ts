import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthState } from './auth.reducer'
import { RouterSelectors } from '@shared/data-access/router'
// import { selectRouteParams } from '../../../../../shared/data-access/router/src/lib/router.selectors'

export const selectAuthState = createFeatureSelector<AuthState>('auth')

export const selectUser = createSelector(selectAuthState, (auth) => auth.user)

export const selectToken = createSelector(selectAuthState, (auth) => auth.token)

export const selectError = createSelector(selectAuthState, (auth) => auth.error)

export const selectErrors = createSelector(selectAuthState, (auth) => auth.errors)

export const isLoggedIn = createSelector(selectAuthState, (auth) => !!auth.user)

export const isLoggedOut = createSelector(isLoggedIn, (loggedIn) => !loggedIn)

export const selectUserNameFromRouteParams = createSelector(
  RouterSelectors.selectRouteParams,
  ({ userName }) => userName,
)
