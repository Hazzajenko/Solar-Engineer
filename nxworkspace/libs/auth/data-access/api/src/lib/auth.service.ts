import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { SignInRequest, SignInResponse, StorageModel } from '@auth/shared/models'

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

  login(request: SignInRequest) {
    return this.http.post<SignInResponse>('/api/auth/login', {
      username: request.username,
      password: request.password,
    })
  }

  register(request: SignInRequest) {
    return this.http.post<SignInResponse>('/api/auth/register', {
      username: request.username,
      password: request.password,
    })
    /*    return this.http.post<SignInResponse>('https:localhost:5000/auth/register', {
          username: request.username,
          password: request.password,
        })*/
  }

  validateUser(userInStorage: StorageModel) {
    return this.http.post<SignInResponse>(
      '/api/auth/validate',
      {
        username: userInStorage.username,
        email: userInStorage.email,
      },
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${userInStorage.token}` }),
      },
    )
  }
}
