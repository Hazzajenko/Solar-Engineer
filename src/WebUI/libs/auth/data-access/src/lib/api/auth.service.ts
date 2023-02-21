import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { SignInResponseWithToken } from '../contracts'
import { GetTokenResponse } from '../contracts/get-token.response'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  // private auth0 = inject(Auth0)

  authorizeRequest() {
    return this.http.get<GetTokenResponse>('/auth/authorize', { withCredentials: true })
    // return this.http.get<GetTokenResponse>('/identity/authorize', { withCredentials: true })
  }

  getToken() {
    return this.http.get<GetTokenResponse>('/auth/token', { withCredentials: true })
    // return this.http.get<GetTokenResponse>('/identity/token', { withCredentials: true })
  }

  loginWithGoogle() {
    return this.http.get('/identity/login/google', { withCredentials: true })
  }

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
