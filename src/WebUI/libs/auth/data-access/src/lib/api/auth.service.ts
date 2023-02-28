import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { GetTokenResponse } from '../contracts/get-token.response'
import { GetUserResponse } from '../contracts/get-user.response'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  authorizeRequest() {
    return this.http.post<GetTokenResponse>('/auth/authorize', {}, { withCredentials: true })
  }

  isReturningUser() {
    return this.http.post<GetTokenResponse>('/auth/returning-user', {})
  }

  getCurrentUser() {
    return this.http.get<GetUserResponse>('/auth/user')
  }

  getToken() {
    return this.http.get<GetTokenResponse>('/auth/token', { withCredentials: true })
  }
}
