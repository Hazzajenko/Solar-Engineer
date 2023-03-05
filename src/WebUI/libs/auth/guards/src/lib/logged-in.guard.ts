import { inject } from '@angular/core'
import { AuthFacade } from '@auth/data-access'
import { tap } from 'rxjs/operators'

export const loggedInGuard = () => {
  const auth = inject(AuthFacade)
  return auth.isLoggedIn$.pipe(
    tap((value) => {
      // return value ? true : router.navigate([''])
      // console.log(value)
      return value
    }),
  )
}
