import { AuthService, AuthStoreService } from '@auth/data-access'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { RouterFacade } from '@shared/data-access/router'
import { switchMap, tap } from 'rxjs/operators'
import { map, of } from 'rxjs'
import { StringTextSchema } from '@shared/utils'

export const handleGetAuthenticated = (
  authService: AuthService,
  authStoreService: AuthStoreService,
  router: Router,
  location: Location,
  routerFacade: RouterFacade,
) => {
  const token = localStorage.getItem('token')
  if (token) {
    if (!authService.isTokenExpired(token)) {
      return authService.isReturningUser().pipe(
        tap(({ token }) => localStorage.setItem('token', token)),
        map(({ token }) => {
          const decoded = authService.decodeToken(token)
          console.log(decoded)
          const decodedUserName = decoded.userName
          const userName = StringTextSchema.parse(decodedUserName).toLowerCase()
          console.log(userName)
          // const urlTree = router.parseUrl(`${userName}`)
          authStoreService.dispatch.signInSuccess(token)
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
          map(({ token }) => {
            localStorage.setItem('token', token)
            authStoreService.dispatch.signInSuccess(token)
            location.go('/')
            return true
          }),
        )
      }
      const urlTree = router.parseUrl(`sign-in`)
      return of(urlTree)
    }),
  )
}
