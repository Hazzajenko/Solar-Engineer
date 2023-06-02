import { getRouterSelectors } from '@ngrx/router-store'
import { inject } from '@angular/core'
import { Store } from '@ngrx/store'
import { AuthActions } from '@auth/data-access'

const { selectQueryParam, selectQueryParams } = getRouterSelectors()

export const selectIsAuthorizeQuery = selectQueryParam('authorize')

export function provideIsAuthorizeQuery() {
	const store = inject(Store)
	return store.selectSignal(selectIsAuthorizeQuery)
}

export function checkIfIsAuthorizeQuery() {
	const store = inject(Store)
	// const authStore = injectAuthStore()
	const query = store.selectSignal(selectIsAuthorizeQuery)()
	if (query === 'true') {
		// authStore.dispatch().authorizeRequest()
		store.dispatch(AuthActions.authorizeRequest())
		return true
	}
	return false
}
