import { getRouterSelectors } from '@ngrx/router-store'
import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthActions, AuthStore, injectAuthStore } from '@auth/data-access'
import { JwtHelperService } from '@auth0/angular-jwt'
import { DIALOG_COMPONENT, injectUiStore, UiStore } from '@overlays/ui-store/data-access'
import { isProjectExisting } from '@entities/utils'

const { selectQueryParam } = getRouterSelectors()

export const selectIsAuthorizeQuery = selectQueryParam('authorize')

export function checkAuthFlow() {
	const store = inject(Store)
	const authStore = injectAuthStore()
	const jwt = inject(JwtHelperService)
	const uiStore = injectUiStore()

	const user = authStore.select.user()
	if (user) {
		return true
	}

	if (handleCheckLocalToken(authStore, jwt, uiStore)) {
		return true
	}

	if (checkIfIsAuthorizeQuery(store)) {
		return true
	}

	if (!isProjectExisting()) {
		setTimeout(() => {
			uiStore.dispatch.openDialog({
				component: DIALOG_COMPONENT.INITIAL_VISIT_WITH_TEMPLATES,
			})
			// uiStore.dispatch.openDialog({
			// 	component: DIALOG_COMPONENT.SIGN_IN,
			// })
		}, 1000)
	} else {
		store.dispatch(AuthActions.signInAsExistingGuest())
	}
	return false
}

function handleCheckLocalToken(authStore: AuthStore, jwt: JwtHelperService, uiStore: UiStore) {
	const token = localStorage.getItem('token')
	if (token) {
		const isTokenExpired = jwt.isTokenExpired(token)
		if (!isTokenExpired) {
			authStore.dispatch.isReturningUser()
			return true
		}
		uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SIGN_IN, // dialog: {
			// component: DIALOG_COMPONENT_TYPE.SIGN_IN,
			// },
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
