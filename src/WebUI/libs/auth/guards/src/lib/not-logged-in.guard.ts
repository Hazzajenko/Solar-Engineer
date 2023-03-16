import { inject } from '@angular/core'
import { AuthFacade, AuthService, AuthStoreService } from '@auth/data-access'
import { switchMap } from 'rxjs/operators'
import { of } from 'rxjs'
import { Router } from '@angular/router'
import { RouterFacade } from '@shared/data-access/router'
import { Location } from '@angular/common'

export const notLoggedInGuard = () => {
  const auth = inject(AuthFacade)
  const authService = inject(AuthService)
  const authStore = inject(AuthStoreService)
  const router = inject(Router)
  const routerStore = inject(RouterFacade)
  const location = inject(Location)
  return auth.isLoggedIn$.pipe(
    switchMap((authenticated) => {
      console.log('guard', authenticated)
      if (authenticated) {
        // return of(false)
        // const urlTree = router.parseUrl(``)
        // return of(urlTree)
        // router.navigate(['']).catch((err) => console.error(err))
        router.navigateByUrl('').catch((err) => console.error(err))
        return of(false)
        // return
      }
      return of(true)
      // const urlTree = router.parseUrl(``)
      // return of(urlTree)
    }),
  )
}
