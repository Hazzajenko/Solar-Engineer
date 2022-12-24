import {inject, Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {SignInRequest, SignInResponse} from "./models";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient)

  public signIn(request: SignInRequest) {
    return this.http
      .post<SignInResponse>('/api/auth/login', {
        username: request.username,
        password: request.password,
      })
  }
}
