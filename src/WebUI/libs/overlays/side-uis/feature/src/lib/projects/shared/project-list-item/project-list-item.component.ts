import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { NgClass, NgIf, NgStyle } from '@angular/common'
import { PluralizePipe } from '@shared/utils'
import { TimeDifferenceFromNowPipe, TruncatePipe } from '@shared/pipes'
import { ProjectWebModel } from '@entities/shared'

@Component({
	selector: 'app-project-list-item',
	standalone: true,
	imports: [NgIf, PluralizePipe, TimeDifferenceFromNowPipe, NgClass, NgStyle, TruncatePipe],
	templateUrl: './project-list-item.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListItemComponent {
	@Input({ required: true }) project!: ProjectWebModel
	@Input() isSelected = false
}
