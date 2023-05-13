import { inject } from '@angular/core'
import { AuthFacade, AuthService, AuthStoreService } from '@auth/data-access'
import { combineLatestWith, switchMap } from 'rxjs/operators'
import { map, of } from 'rxjs'
import { Router } from '@angular/router'
import { RouterFacade } from '@shared/data-access/router'
import { Location } from '@angular/common'
/*this.routerStore.queryParam$('authorize').subscribe((params) => {
 // console.log(params)
 this.logDebug('authorize', params)
 // this.logger.debug({ source: 'AppComponent', objects: ['authorize', params] })
 // this.logger
 if (params === 'true') {
 this.authStore.dispatch.authorizeRequest()
 /!*        this.router
 .navigateByUrl('')
 .then()
 .catch((err) => console.error(err))*!/
 } else {
 this.authStore.dispatch.isReturningUser()
 }
 })*/
export const loggedInV2Guard = () => {
  const auth = inject(AuthFacade)
  const authService = inject(AuthService)
  const authStore = inject(AuthStoreService)
  const router = inject(Router)
  const routerStore = inject(RouterFacade)
  const location = inject(Location)
  // const jwtHelperService = inject(JwtHelperService)
  const token = localStorage.getItem('token')
  // jwtDecode(token)
  return auth.isLoggedIn$.pipe(
    combineLatestWith(routerStore.queryParam$('authorize')),
    switchMap(([authenticated, authorizeQuery]) => {
      console.log('guard', authenticated, authorizeQuery)
      if (authenticated) {
        if (authorizeQuery === 'true') {
          location.go('/')
        }
        return of(true)
      }
      // If the user is not authenticated...
      if (!authenticated) {
        if (token) {
          /*          const decoded = jwtDecode(token)
           console.log(decoded)
           const now = Date.now().valueOf() / 1000
           console.log(now)
           if (decoded.exp > now) {
           authStore.dispatch.signInSuccess(token)
           return of(true)
           }*/
          if (!authService.isTokenExpired(token)) {
            /*         return authService.isReturningUser().pipe(
             tap(({ token }) => localStorage.setItem('token', token)),
             map(({ token }) => AuthActions.signInSuccess({ token })),
             )*/
            authStore.dispatch.isReturningUser()
            /*       this.authService.isReturningUser().pipe(
             tap(({ token }) => localStorage.setItem('token', token)),
             map(({ token }) => AuthActions.signInSuccess({ token })),
             ),*/
            if (authorizeQuery === 'true') {
              location.go('/')
            }
            // const urlTree = router.parseUrl(`${user.}`)
            // return of(urlTree)
            return of(true)
          }
        }

        // authStore.select.token$

        // const isReturningUser = authService.isReturningUser()
        // Redirect to the sign-in page with a redirectUrl param
        // const redirectURL = `/${segments.join('/')}`;
        // const redirectURL = ``
        // const urlTree = router.parseUrl(``)
        // const urlTree = router.parseUrl(`sign-in?redirectURL=${redirectURL}`)
        // const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);
        const route = router.url
        console.log(route)
        // routerStore.
        if (authorizeQuery === 'true') {
          console.log('authorize')
          return authService.authorizeRequest().pipe(
            // tap(({ token }) => localStorage.setItem('token', token)),
            map(({ token }) => {
              localStorage.setItem('token', token)
              authStore.dispatch.signInSuccess(token)
              location.go('/')
              return true
              // router.navigateByUrl('').catch((err) => console.error(err))
              // const urlTree = router.parseUrl(``)
              // return urlTree
              // location.go('/')
              // return true
              // return AuthActions.signInSuccess({ token })
            }),
            /*            catchError((error) => {
             console.error(error)
             const urlTree = router.parseUrl(`sign-in`)
             return of(urlTree)
             // return of(false)
             }),*/
          )
        }
        const urlTree = router.parseUrl(`sign-in`)
        return of(urlTree)
      }

      // Allow the access
      return of(true)
    }),
  )
}
