import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit } from '@angular/core'
import { AuthStoreService } from '@auth/data-access'
import { Router } from '@angular/router'

import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './sign-in.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  standalone: true,
})
export class SignInComponent implements OnInit {
  private authStore = inject(AuthStoreService)
  private router = inject(Router)
  private http = inject(HttpClient)

  // private authService = inject(AuthService)

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // this.authStore.dispatch.authorizeRequest()
  }

  loginWithGoogle() {
    // this.router.url
    const redirectURL = this.router.url
    const urlTree = this.router.parseUrl(`/login/google`)
    // const urlTree = this.router.parseUrl(`/login/google?redirectURL=${redirectURL}`)
    console.log(urlTree)
    // this.router.navigateByUrl(urlTree).catch((err) => console.error(err))
    window.location.href = '/login/google'
    // window.location.href = '/auth-api/login/google'
    // this.authStore.dispatch.loginWithGoogle()
  }
}
