import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AuthStoreService } from '@auth/data-access'
import { Router } from '@angular/router'

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  standalone: true,
})
export class SignInComponent {
  private authStore = inject(AuthStoreService)
  private router = inject(Router)

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
