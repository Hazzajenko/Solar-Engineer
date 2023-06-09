import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgForOf } from '@angular/common'
import { createProject } from '@nx/angular/src/generators/application/lib'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { injectAuthStore } from '@auth/data-access'

@Component({
	selector: 'side-ui-users-view',
	standalone: true,
	imports: [NgForOf, ShowSvgNoStylesComponent],
	templateUrl: './side-ui-users-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiUsersViewComponent {
	private _authStore = injectAuthStore()

	user = this._authStore.select.user

	protected readonly createProject = createProject
	protected readonly createProject = createProject
}
