import { Component } from '@angular/core'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { goRightWithConfig } from '@shared/animations'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { injectAuthStore } from '@auth/data-access'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { SideUiBaseComponent } from '../side-ui-base/side-ui-base.component'
import { AuthSignOutButtonComponent } from '@auth/ui'

@Component({
	selector: 'side-ui-auth-view',
	standalone: true,
	templateUrl: 'side-ui-auth-view.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [
		NgIf,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		NgOptimizedImage,
		SideUiBaseComponent,
		AuthSignOutButtonComponent,
	],
	hostDirectives: [MouseOverRenderDirective],
	styles: [],
})
export class SideUiAuthViewComponent {
	private _auth = injectAuthStore()
	private _uiStore = injectUiStore()
	user = this._auth.select.user

	// @Input() width = 60

	openSignInDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SIGN_IN,
		})
	}
}
