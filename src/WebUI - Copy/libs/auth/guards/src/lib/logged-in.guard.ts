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

/*
return this._authService.check().pipe(
  switchMap((authenticated) => {

    // If the user is not authenticated...
    if ( !authenticated )
    {
      // Redirect to the sign-in page with a redirectUrl param
      const redirectURL = `/${segments.join('/')}`;
      const urlTree = this._router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

      return of(urlTree);
    }

    // Allow the access
    return of(true);
  })
);*/
