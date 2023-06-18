import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { LetDirective } from '@ngrx/component'
import { NgForOf, NgIf } from '@angular/common'
import { ProjectWebModel } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'
import { TruncatePipe } from '@shared/pipes'
import { SideUiViewHeadingComponent } from '../../../shared'

@Component({
	selector: 'app-project-members-view',
	standalone: true,
	imports: [
		AuthWebUserAvatarComponent,
		LetDirective,
		NgForOf,
		TruncatePipe,
		NgIf,
		SideUiViewHeadingComponent,
	],
	templateUrl: './project-members-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMembersViewComponent {
	user = injectAppUser()

	@Input({ required: true }) project!: ProjectWebModel
}
