import { getRouterSelectors } from '@ngrx/router-store'
import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthActions, AuthStore, injectAuthStore } from '@auth/data-access'
import { JwtHelperService } from '@auth0/angular-jwt'
import { injectUiStore, UiStore } from '@overlays/ui-store/data-access'

const { selectQueryParam } = getRouterSelectors()

export const selectIsAuthorizeQuery = selectQueryParam('authorize')

export function checkAuthFlow() {
	const store = inject(Store)
	const authStore = injectAuthStore()
	const jwt = inject(JwtHelperService)
	const uiStore = injectUiStore()

	const user = authStore.select('selectUser')()
	if (user) {
		return true
	}

	if (handleCheckLocalToken(authStore, jwt, uiStore)) {
		return true
	}

	if (checkIfIsAuthorizeQuery(store)) {
		return true
	}

	setTimeout(() => {
		uiStore.dispatch('openDialog', {
			dialog: {
				component: 'SignInDialogComponent',
			},
		})
	}, 1000)
	return false
}

function handleCheckLocalToken(authStore: AuthStore, jwt: JwtHelperService, uiStore: UiStore) {
	const token = localStorage.getItem('token')
	if (token) {
		const isTokenExpired = jwt.isTokenExpired(token)
		if (!isTokenExpired) {
			authStore.dispatch('isReturningUser', undefined)
			return true
		}
		uiStore.dispatch('openDialog', {
			dialog: {
				component: 'SignInDialogComponent',
			},
		})
	}
	return false
}

function checkIfIsAuthorizeQuery(store: Store) {
	const query = store.selectSignal(selectIsAuthorizeQuery)()
	if (query === 'true') {
		// authStore.dispatch().authorizeRequest()
		store.dispatch(AuthActions.authorizeRequest())
		return true
	}
	return false
}
