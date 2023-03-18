import { inject } from '@angular/core'
import { AuthFacade, AuthService, AuthStoreService } from '@auth/data-access'
import { combineLatestWith, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { Router } from '@angular/router'
import { RouterFacade } from '@shared/data-access/router'
import { Location } from '@angular/common'
import { handleGetAuthenticated } from './handle-get-authenticated'

export const emptyRouteAuthGuard = () => {
  const auth = inject(AuthFacade)
  const authService = inject(AuthService)
  const authStore = inject(AuthStoreService)
  const router = inject(Router)
  const routerStore = inject(RouterFacade)
  const location = inject(Location)
  return auth.user$.pipe(
    combineLatestWith(routerStore.queryParam$('authorize')),
    switchMap(([user, authorizeQuery]) => {
      console.log('guard', user, authorizeQuery)
      if (user) {
        if (authorizeQuery === 'true') {
          location.go('/')
        }
        /*        const userName = user.userName.toLowerCase()
                const urlTree = router.parseUrl(`${userName}`)
                return of(urlTree)*/
        return of(true)
      }

      return handleGetAuthenticated(authService, authStore, router, location, routerStore)

      // return of(true)
    }),
  )
}
