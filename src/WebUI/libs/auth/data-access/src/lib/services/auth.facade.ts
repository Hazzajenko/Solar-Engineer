import { inject, Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { firstValueFrom, of } from 'rxjs'
import { AppUserModel } from '@shared/data-access/models'

@Injectable({
	providedIn: 'root',
})
export class AuthFacade {
	private store = inject(Store)
	// private auth0 = inject(Auth0)
	user$ = of({} as AppUserModel)
	// user$ = this.store.select(AuthSelectors.selectUser)
	userName$ = of('')
	// userName$ = this.user$.pipe(map((user) => user?.userName))

	// user = firstValueFrom(this.user$)
	isLoggedIn$ = of(true)
	// isLoggedIn$ = this.store.select(AuthSelectors.isLoggedIn)
	// isLoggedIn = firstValueFrom(this.isLoggedIn$)

	token$ = of(localStorage.getItem('token'))
	// isAuthenticated$ = this.store.select(AuthSelectors.isLoggedIn)
	// isAuthenticated$ = of(true)

	// userName = () => firstValueFrom(this.userName$)
	get userName() {
		return firstValueFrom(of(''))
		// return firstValueFrom(this.userName$.pipe(map((userName) => userName?.toLowerCase())))
	}

	get userId() {
		return firstValueFrom(of('1'))
		// return firstValueFrom(this.user$.pipe(map((user) => user?.id)))
	}

	get token() {
		return firstValueFrom(this.token$)
	}

	get isLoggedIn() {
		return firstValueFrom(this.isLoggedIn$)
	}

	get user() {
		return firstValueFrom(this.user$)
	}

	// isAuthenticated$ = this.auth0.isAuthenticated$

	/*
	 async userId() {
	 return (
	 (await firstValueFrom(this.user$.pipe(map((user) => user?.id)))) ??
	 throwExpression('User not logged in')
	 )
	 }
	 */

	/*
	 async userId2() {
	 return (
	 (await firstValueFrom(this.user$.pipe(map((user) => user?.id)))) ??
	 throwExpression('User not logged in')
	 )
	 }
	 */

	/*  async isLoggedIn() {
	 return (await firstValueFrom(this.isLoggedIn$)) ?? throwExpression('User not logged in')
	 }*/

	/*  async user() {
	 return (await firstValueFrom(this.user$)) ?? throwExpression('User not logged in')
	 }*/
}
