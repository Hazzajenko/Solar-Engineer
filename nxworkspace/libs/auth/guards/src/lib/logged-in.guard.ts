import { inject } from '@angular/core'
import { Router } from '@angular/router'
import { AuthFacade } from '@auth/data-access/store'
import { tap } from 'rxjs/operators'

export const loggedInGuard = () => {
  const router = inject(Router)
  const auth = inject(AuthFacade)
  return auth.isLoggedIn$.pipe(
    tap((value) => {
      // return value ? true : router.navigate([''])
      console.log(value)
      return value
    }),
  )
}
