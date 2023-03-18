import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetTokenResponse } from '../contracts/get-token.response'
import { GetUserResponse } from '../contracts/get-user.response'
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)
  private jwtHelperService = inject(JwtHelperService)

  authorizeRequest() {
    return this.http.post<GetTokenResponse>('/auth-api/authorize', {}, { withCredentials: true })
  }

  isTokenExpired(token: string) {
    return this.jwtHelperService.isTokenExpired(token)
  }

  decodeToken(token: string) {
    return this.jwtHelperService.decodeToken(token)
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
