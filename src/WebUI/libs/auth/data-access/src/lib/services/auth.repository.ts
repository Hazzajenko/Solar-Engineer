import { inject, Injectable } from '@angular/core'
import { AuthActions } from '../store/auth'
import { Store } from '@ngrx/store'
import { AppUserModel } from '@shared/data-access/models'

@Injectable({
	providedIn: 'root',
})
export class AuthRepository {
	private store = inject(Store)

	login() {
		this.store.dispatch(AuthActions.login())
	}

	signInSuccess(token: string) {
		this.store.dispatch(AuthActions.signInSuccess({ token, user: {} as AppUserModel }))
	}

	signInFetchUserSuccess(token: string, user: AppUserModel) {
		this.store.dispatch(AuthActions.signInFetchUserSuccess({ token, user }))
	}

	signInWithGoogle() {
		this.store.dispatch(AuthActions.signInWithGoogle())
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
