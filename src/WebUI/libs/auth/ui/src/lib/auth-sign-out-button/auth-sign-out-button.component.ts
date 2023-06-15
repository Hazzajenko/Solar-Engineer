import { ChangeDetectionStrategy, Component } from '@angular/core'
import { injectAuthStore } from '@auth/data-access'

@Component({
	selector: 'auth-sign-out-button',
	standalone: true,
	imports: [],
	templateUrl: './auth-sign-out-button.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthSignOutButtonComponent {
	private _authStore = injectAuthStore()

	signOut() {
		this._authStore.dispatch.signOut()
	}
}
