import { Component } from '@angular/core'
import { NgIf, NgOptimizedImage } from '@angular/common'
import { goRightWithConfig } from '@shared/animations'
import { ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { MouseOverRenderDirective } from '@canvas/rendering/data-access'
import { injectAuthStore } from '@auth/data-access'

@Component({
	selector: 'side-ui-auth-view',
	standalone: true,
	templateUrl: 'side-ui-auth-view.component.html',
	animations: [goRightWithConfig('0.25s')],
	imports: [NgIf, ShowSvgComponent, ShowSvgNoStylesComponent, NgOptimizedImage],
	hostDirectives: [MouseOverRenderDirective],
})
export class SideUiAuthViewComponent {
	private _auth = injectAuthStore()
	user = this._auth.select.user
}
