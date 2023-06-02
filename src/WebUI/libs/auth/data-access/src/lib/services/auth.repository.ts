import { inject, Injectable } from '@angular/core'
import { AuthActions } from '../store'
import { Store } from '@ngrx/store'
import { AuthUserModel } from '@shared/data-access/models'

@Injectable({
	providedIn: 'root',
})
export class AuthRepository {
	private store = inject(Store)

	login() {
		this.store.dispatch(AuthActions.login())
	}

	signInSuccess(token: string) {
		this.store.dispatch(AuthActions.signInSuccess({ token, user: {} as AuthUserModel }))
	}

	signInFetchUserSuccess(token: string, user: AuthUserModel) {
		this.store.dispatch(AuthActions.signInFetchUserSuccess({ token, user }))
	}

	loginWithGoogle() {
		this.store.dispatch(AuthActions.loginWithGoogle())
	}

	authorizeRequest() {
		this.store.dispatch(AuthActions.authorizeRequest())
	}

	isReturningUser() {
		this.store.dispatch(AuthActions.isReturningUser())
	}

	signOut() {
		// TODO implement signOut
		this.store.dispatch(AuthActions.signOut())
	}
}
