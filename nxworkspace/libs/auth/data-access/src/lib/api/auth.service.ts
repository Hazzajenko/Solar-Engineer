import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { SignInResponse } from '../contracts/sign-in.response'
// import { Auth0ClientService } from '@auth0/auth0-angular'
import { AuthService as Auth0 } from '@auth0/auth0-angular'
import { switchMap } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  // private auth0 = inject(Auth0)

  login() {
    /*    return this.auth0.getAccessTokenSilently().pipe(
          switchMap((token) =>
            this.http.post<SignInResponse>('/api/auth0/login', null, {
              headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
              }),
            }),
          ),
        )*/
  }
}
