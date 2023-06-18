import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ProjectWebModel } from '@entities/shared'
import { NgIf, NgStyle } from '@angular/common'

@Component({
	selector: 'app-project-currently-selected',
	standalone: true,
	imports: [NgIf, NgStyle],
	templateUrl: './project-currently-selected.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectCurrentlySelectedComponent {
	@Input({ required: true }) selectedProject!: ProjectWebModel
}
