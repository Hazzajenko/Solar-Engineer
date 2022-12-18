import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

import { Store } from '@ngrx/store'
import { UserModel } from '@shared/data-access/models'
import { JwtHelperService } from '@auth0/angular-jwt'
import decode from 'jwt-decode'
import { Observable } from 'rxjs'
// import { selectUser } from '@auth/data-access/store'
import { map, take } from 'rxjs/operators'

// import { addUserAndToken } from '@auth/data-access/store'
import { AppState } from '@shared/data-access/store'
import { addUserAndToken } from '@auth/data-access/store'

export interface SignInRequest {
  email: string
  password: string
}

interface SignInRequestV2 {
  username: string
  password: string
}

interface SignInResponse {
  // appUser: UserModel
  email: string
  firstName: string
  lastName: string
  username: string
  token: string
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser?: UserModel
  user$!: Observable<any>

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private jwt: JwtHelperService,
  ) {
    // this.user$ = this.store.select(selectUser)
  }

  token() {
    return this.user$
      .pipe(
        take(1),
        map((u) => u && u.token),
      )
      .toPromise()
  }

  public isAuthenticated(token: string) {
    if (token) {
      const tokenPayload = decode(token)
      // console.log("token", tokenPayload);
      return !this.jwt.isTokenExpired(token)
    } else {
      return false
    }
  }

  public signIn(request: SignInRequestV2) {
    return new Promise<SignInResponse>((resolve, reject) =>
      this.http
        .post<SignInResponse>('/api/auth/login', {
          username: request.username,
          password: request.password,
          /*          email: request.email,
                    password: request.password,*/
        })
        .subscribe({
          next: (res) => {
            this.currentUser = {
              email: res.email,
              firstName: res.firstName,
              lastName: res.lastName,
              username: res.username,
            }
            const tokenPayload = decode(res.token)
            // console.log(tokenPayload);
            localStorage.setItem('token', res.token)
            this.store.dispatch(
              addUserAndToken({
                user: {
                  email: res.email,
                  firstName: res.firstName,
                  lastName: res.lastName,
                  username: res.username,
                },
                token: res.token,
              }),
            )
            resolve(res)
          },
          error: (err: any) => {
            reject(err)
          },
          complete: () => {
            // console.log("complete");
          },
        }),
    )
  }
}
