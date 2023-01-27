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
      userName: request.userName,
      password: request.password,
    })
  }

  login(request: SignInRequest) {
    return this.http.post<SignInResponse>('/api/auth/login', {
      userName: request.userName,
      password: request.password,
    })
  }

  register(request: SignInRequest) {
    return this.http.post<SignInResponse>('/api/auth/register', {
      userName: request.userName,
      password: request.password,
    })
    /*    return this.http.post<SignInResponse>('https:localhost:5000/auth/register', {
          userName: request.userName,
          password: request.password,
        })*/
  }

  validateUser(userInStorage: StorageModel) {
    return this.http.post<SignInResponse>(
      '/api/auth/validate',
      {
        userName: userInStorage.userName,
        email: userInStorage.email,
      },
      {
        headers: new HttpHeaders({ Authorization: `Bearer ${userInStorage.token}` }),
      },
    )
  }
}
