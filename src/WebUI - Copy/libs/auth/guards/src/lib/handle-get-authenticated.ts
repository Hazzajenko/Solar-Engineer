import { Location } from '@angular/common'
import { Router } from '@angular/router'
import { AuthService, AuthStoreService } from '@auth/data-access'
import { RouterFacade } from '@shared/data-access/router'
import { StringTextSchema } from '@shared/utils'
import { map, of } from 'rxjs'
import { switchMap, tap } from 'rxjs/operators'


export const handleGetAuthenticated = (
  authService: AuthService,
  authStoreService: AuthStoreService,
  router: Router,
  location: Location,
  routerFacade: RouterFacade,
  authorizeQuery: string | undefined,
) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (!authService.isTokenExpired(token)) {
      return authService.isReturningUser().pipe(
        tap(({ token }) => localStorage.setItem('token', token)),
        map(({ token, user }) => {
          const decoded = authService.decodeToken(token)
          console.log(decoded)
          const decodedUserName = decoded.userName
          const userName = StringTextSchema.parse(decodedUserName).toLowerCase()
          console.log(userName)
          // const urlTree = router.parseUrl(`${userName}`)
          authStoreService.dispatch.signInFetchUserSuccess(token, user)
          // authStoreService.dispatch.signInSuccess(token)
          if (authorizeQuery === 'true') {
            console.log('authorize')
            const route = router.url
            console.log('route', route)
            router.navigate([router.url]).catch((err) => {
              console.error(err)
            })
            // location.go(`/`)
          }
          // const url = router.createUrlTree(['/']).toString()

          // location.go(url)
          // this.location.go(url);
          /*   const urlTree = router.createUrlTree([router.url], {
           queryParams: {},
           preserveFragment: false,
           })*/
          // const urlTree = router.parseUrl(router.url)
          // return of(urlTree)
          // location.go(``)

          // return urlTree
          return true
        }),
      )
    }
  }

  return routerFacade.queryParam$('authorize').pipe(
    switchMap((authorizeQuery) => {
      if (authorizeQuery === 'true') {
        console.log('authorize')
        return authService.authorizeRequest().pipe(
          map(({ token, user }) => {
            localStorage.setItem('token', token)
            authStoreService.dispatch.signInFetchUserSuccess(token, user)
            // authStoreService.dispatch.signInSuccess(token)
            // location.go('/')
            router.navigate([router.url]).catch((err) => {
              console.error(err)
            })
            return true
          }),
        )
      }
      const urlTree = router.parseUrl(`sign-in`)
      return of(urlTree)
    }),
  )
}