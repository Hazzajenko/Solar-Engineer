import { Injectable } from '@angular/core'

import * as auth0 from 'auth0-js'
import { AUTH_CONFIG } from './auth-config'
import { Router } from '@angular/router'
import { map, of, timer } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class Auth0Service {
  userProfile: any
  refreshSubscription: any
  // requestedScopes: string = 'openid profile read:timesheets create:timesheets';
  requestedScopes = 'openid profile read:current_user'
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.audience,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: this.requestedScopes,
    leeway: 30,
  })

  constructor(public router: Router) {}

  public login(): void {
    this.auth0.authorize()
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      console.log(authResult)
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = ''
        this.setSession(authResult)
        this.router.navigate(['/home'])
      } else if (err) {
        this.router.navigate(['/home'])
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }

  public getProfile(cb: any): void {
    const accessToken = localStorage.getItem('access_token')
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile')
    }

    // const self = this
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      this.userProfile = profile
      cb(err, profile)
      // return profile
      /*      if (profile) {
              self.userProfile = profile
            }
            cb(err, profile)*/
    })
  }

  private setSession(authResult: auth0.Auth0DecodedHash): void {
    // Set the time that the access token will expire at
    if (!authResult.expiresIn) return
    if (!authResult.accessToken) return
    if (!authResult.idToken) return
    const expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime())

    // If there is a value on the `scope` param from the authResult,
    // use it to set scopes in the session for the user. Otherwise
    // use the scopes as requested. If no scopes were requested,
    // set it to nothing
    const scopes = authResult.scope || this.requestedScopes || ''

    localStorage.setItem('access_token', authResult.accessToken)
    localStorage.setItem('id_token', authResult.idToken)
    localStorage.setItem('expires_at', expiresAt)
    localStorage.setItem('scopes', JSON.stringify(scopes))
    this.scheduleRenewal()
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')
    localStorage.removeItem('scopes')
    this.unscheduleRenewal()
    // Go back to the home route
    this.router.navigate(['/'])
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    // const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    // return new Date().getTime() < expiresAt
    const expires_at = localStorage.getItem('expires_at')
    if (expires_at) {
      const expiresAt = JSON.parse(expires_at)
      return new Date().getTime() < expiresAt
    }
    return false
  }

  public userHasScopes(scopes: Array<string>): boolean {
    const _scopes = localStorage.getItem('scopes')
    if (!_scopes) return false
    const grantedScopes = JSON.parse(_scopes).split(' ')
    return scopes.every((scope) => grantedScopes.includes(scope))
  }

  public renewToken() {
    this.auth0.renewAuth(
      {
        audience: AUTH_CONFIG.audience,
        redirectUri: AUTH_CONFIG.silentCallbackURL,
        usePostMessage: true,
      },
      (err, result) => {
        if (err) {
          //alert(`Could not get a new token using silent authentication (${err.error}).`);
        } else {
          //alert(`Successfully renewed auth!`);
          this.setSession(result)
        }
      },
    )
  }

  public scheduleRenewal() {
    if (!this.isAuthenticated()) return

    const expires_at = window.localStorage.getItem('expires_at')
    if (!expires_at) return
    const expiresAt = JSON.parse(expires_at)

    const source = of(expiresAt).pipe(
      map((expiresAt) => {
        const now = Date.now()

        // Use the delay in a timer to
        // run the refresh at the proper time
        const refreshAt = expiresAt - 1000 * 30 // Refresh 30 seconds before expiry
        return timer(Math.max(1, refreshAt - now))
      }),
    )

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSubscription = source.subscribe(() => {
      this.renewToken()
    })
  }

  public unscheduleRenewal() {
    if (!this.refreshSubscription) return
    this.refreshSubscription.unsubscribe()
  }
}
