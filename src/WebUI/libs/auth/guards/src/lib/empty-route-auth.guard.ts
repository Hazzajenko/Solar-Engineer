import { handleGetAuthenticated } from './handle-get-authenticated'
import { Location } from '@angular/common'
import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthFacade, AuthService, AuthStoreService } from '@auth/data-access'
import { RouterFacade } from '@shared/data-access/router'
import { of } from 'rxjs'
import { combineLatestWith, switchMap } from 'rxjs/operators'

export const emptyRouteAuthGuard = () => {
	const auth = inject(AuthFacade)
	const authService = inject(AuthService)
	const authStore = inject(AuthStoreService)
	const router = inject(Router)
	const routerStore = inject(RouterFacade)
	const location = inject(Location)
	console.log('emptyRouteAuthGuard', this)
	return auth.user$.pipe(
		combineLatestWith(routerStore.queryParam$('authorize')),
		switchMap(([user, authorizeQuery]) => {
			console.log('guard', user, authorizeQuery)
			if (user) {
				if (authorizeQuery === 'true') {
					console.log('authorizeQuery', authorizeQuery)
					// location.go('')
					// const route = router.url
					// console.log('route', route)
					router.navigate([router.url]).catch((err) => {
						console.error(err)
						throw err
					})
					// const urlTree = router.parseUrl(``)
				}
				/*        const userName = user.userName.toLowerCase()
			 const urlTree = router.parseUrl(`${userName}`)
			 return of(urlTree)*/
				return of(true)
			}

			return handleGetAuthenticated(
				authService,
				authStore,
				router,
				location,
				routerStore,
				authorizeQuery,
			)

			// return of(true)
		}),
	)
}
