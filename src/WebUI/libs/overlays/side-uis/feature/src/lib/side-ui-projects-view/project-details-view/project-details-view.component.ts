import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { TAILWIND_COLOUR_500_VALUES } from '@shared/data-access/models'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { LetDirective } from '@ngrx/component'
import { NgForOf, NgIf, NgStyle } from '@angular/common'
import { injectAppUser } from '@auth/data-access'
import { ProjectWebModel } from '@entities/shared'
import { TruncatePipe } from '@shared/pipes'

@Component({
	selector: 'app-project-details-view',
	standalone: true,
	imports: [AuthWebUserAvatarComponent, LetDirective, NgForOf, NgStyle, TruncatePipe, NgIf],
	templateUrl: './project-details-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailsViewComponent {
	user = injectAppUser()
	@Input({ required: true }) project!: ProjectWebModel
	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES
}
