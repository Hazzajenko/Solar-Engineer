import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetTokenResponse } from '../contracts/get-token.response'
import { GetUserResponse } from '../contracts/get-user.response'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  authorizeRequest() {
    return this.http.post<GetTokenResponse>('/auth-api/authorize', {}, { withCredentials: true })
  }

  isReturningUser() {
    return this.http.post<GetTokenResponse>('/auth-api/returning-user', {})
  }

  getCurrentUser(token?: string) {
    return this.http.get<GetUserResponse>('/auth-api/user', {
      headers: token ? this.getAuthorizationHeader(token) : undefined,
    })
  }

  getToken() {
    return this.http.get<GetTokenResponse>('/auth-api/token', { withCredentials: true })
  }

  getAuthorizationHeader(token: string) {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`)
  }
}
