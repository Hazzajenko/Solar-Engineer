import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router'
import { inject, Injectable } from '@angular/core'
import { AuthFacade } from '@auth/data-access'
import { Observable, of } from 'rxjs'
import { switchMap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanMatch {
  private auth = inject(AuthFacade)
  private router = inject(Router)

  canMatch(
    route: Route,
    segments: UrlSegment[],
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._check(segments)
  }

  private _check(segments: UrlSegment[]): Observable<boolean | UrlTree> {
    // Check the authentication status
    return this.auth.isLoggedIn$.pipe(
      switchMap((authenticated) => {
        if (!authenticated) {
          // Redirect to the sign-in page with a redirectUrl param
          const redirectURL = `/${segments.join('/')}`
          const urlTree = this.router.parseUrl(`/auth-api/login/google?redirectURL=${redirectURL}`)
          // const urlTree = this.router.parseUrl(`sign-in?redirectURL=${redirectURL}`);

          return of(urlTree)
        }

        // Allow the access
        return of(true)
      }),
    )
  }
}
