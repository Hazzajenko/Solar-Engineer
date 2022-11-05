import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from './auth.service';
import { AppState } from '../store/app.state';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private auth: AuthService
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    // return true;
    const token = await this.auth.token();
    const isLoggedIn = !!token;
    console.log(token);
    console.log(isLoggedIn);
    if (!this.auth.isAuthenticated(token)) {
      this.router.navigateByUrl('/').then();
      /*      const alert = await this.alertController.create({
              header: 'Blocked',
              subHeader: 'Registered Users only',
              message: 'Please Sign In...',
              cssClass: 'alert-warning',
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.router.navigateByUrl('/sign-in');
                  },
                },
              ],
            });

            await alert.present();*/
      // this.router.navigateByUrl('/dsad');
      // return of(false);
    }
    return this.auth.isAuthenticated(token);
    // return of(true);
  }
}
