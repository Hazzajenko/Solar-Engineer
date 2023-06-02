import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AuthStoreService } from '@auth/data-access'
import { Router } from '@angular/router'

import { HttpClient } from '@angular/common/http'

@Component({
	selector: 'app-sign-in-v2',
	templateUrl: './sign-in-v2.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [],
	standalone: true,
})
export class SignInV2Component {
	private authStore = inject(AuthStoreService)
	private router = inject(Router)
	private http = inject(HttpClient)

	loginWithGoogle() {
		// this.router.url
		const redirectURL = this.router.url
		const urlTree = this.router.parseUrl(`/login/google`)
		// const urlTree = this.router.parseUrl(`/login/google?redirectURL=${redirectURL}`)
		console.log(urlTree)
		// this.router.navigateByUrl(urlTree).catch((err) => console.error(err))
		window.location.href = '/login/google'
		// window.location.href = '/auth/login/google'
		// this.authStore.dispatch.loginWithGoogle()
	}
}
