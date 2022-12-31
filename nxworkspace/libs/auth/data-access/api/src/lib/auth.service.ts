import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { SignInRequest, SignInResponse } from '@auth/shared/models'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  public signIn(request: SignInRequest) {
    return this.http.post<SignInResponse>('/api/auth/login', {
      username: request.username,
      password: request.password,
    })
  }

  validateUser(usr: string, eml: string, tkn: string) {
    return this.http.post<SignInResponse>(
      '/api/auth/validate',
      {
        username: usr,
        email: eml,
      },
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${tkn}` }),
      },
    )
  }
}
