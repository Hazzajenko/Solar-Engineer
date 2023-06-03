import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgIf } from '@angular/common'
import { injectAuthStore } from '@auth/data-access'

@Component({
	selector: 'side-ui-projects-view',
	standalone: true,
	imports: [NgIf],
	templateUrl: './side-ui-projects-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiProjectsViewComponent {
	private _auth = injectAuthStore()
	user = this._auth.select.user
}
