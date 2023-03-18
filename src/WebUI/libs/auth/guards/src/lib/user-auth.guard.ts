import { inject } from '@angular/core'
import { AuthFacade, AuthService, AuthStoreService } from '@auth/data-access'
import { combineLatestWith, switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { Router } from '@angular/router'
import { RouterFacade } from '@shared/data-access/router'
import { Location } from '@angular/common'
import { handleGetAuthenticated } from './handle-get-authenticated'

export const userAuthGuard = () => {
  const auth = inject(AuthFacade)
  const authService = inject(AuthService)
  const authStore = inject(AuthStoreService)
  const router = inject(Router)
  const routerStore = inject(RouterFacade)
  const location = inject(Location)
  console.log(router)
  // const route = inject(ActivatedRouteSnapshot)
  // const state = inject(RouterStateSnapshot)
  // const jwtHelperService = inject(JwtHelperService)
  const token = localStorage.getItem('token')
  // jwtDecode(token)
  // route.url
  // console.log('route', route)
  // console.log('state', state)
  // console.log('router', router.url)
  // console.log('router', router.url)

  return auth.user$.pipe(
    combineLatestWith(routerStore.routeUrls$),
    switchMap(([user, urls]) => {
      // console.log('guard', user, urls)
      // console.log('guard', user)
      if (user) {
        // const userName = user.userName
        const userName = user.userName.toLowerCase()
        if (userName === urls[0].path) {
          console.log('same user')
          return of(true)
        }
        // const urlTree = router.parseUrl(`${userName}`)
        // return of(urlTree)
        console.log('different user')
        return of(true)
      }

      return handleGetAuthenticated(authService, authStore, router, location, routerStore)

      // return of(true)
    }),
  )
}
