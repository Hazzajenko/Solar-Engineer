import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Store } from '@ngrx/store';
import { UserModel } from './user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { selectUser } from './store/auth.selectors';
import { map, take } from 'rxjs/operators';

import { signIn } from './store/auth.actions';
import { AppState } from '../store/app.state';

export interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  user: UserModel;
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // authLoader: HTMLIonLoadingElement;
  currentUser?: UserModel;
  user$: Observable<any>;

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private jwt: JwtHelperService
  ) {
    this.user$ = this.store.select(selectUser);
  }

  token() {
    return this.user$
      .pipe(
        take(1),
        map((u) => u && u.token)
      )
      .toPromise();
  }

  public isAuthenticated(token: string) {
    if (token) {
      // const token = this.currentUser.token;
      const tokenPayload = decode(token);
      console.log('token', tokenPayload);
      return !this.jwt.isTokenExpired(token);
    } else {
      return false;
    }
  }

  public signIn(request: SignInRequest) {
    return new Promise<SignInResponse>((resolve, reject) =>
      this.http
        .post<SignInResponse>(environment.apiUrl + '/auth/login', {
          email: request.email,
          password: request.password,
        })
        .subscribe({
          next: (res) => {
            const data = {
              id: res.user.id,
              email: res.user.email,
              name: res.user.name,
              activated: res.user.activated,
              createdAt: res.user.createdAt,
              //toklens
            } as UserModel;
            this.currentUser = res.user;
            const tokenPayload = decode(res.token);
            console.log(tokenPayload);
            localStorage.setItem('token', JSON.stringify(res.token));

            this.store.dispatch(signIn({ user: res.user }));
            resolve(res);
          },
          error: (err: any) => {
            reject(err);
          },
          complete: () => {
            console.log('complete');
          },
        })
    );
  }

  /*  getDecodedToken(token) {
      return JSON.parse(atob(token.split('.')[1]));
    }*/

  /*  public getUserProjects() {
      return new Promise<ProjectModel[]>((resolve, reject) =>
        this.http
          .get<ProjectModel[]>(environment.apiUrl + '/projects')
          .subscribe({
            next: (projects) => {
              this.store.dispatch(addUserProjects({ projects }));
              resolve(projects);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
              console.log('complete');
            },
          })
      );
    }*/
}
