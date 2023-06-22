import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { InputSvgComponent } from '@shared/ui'
import { NgIf, NgOptimizedImage, NgTemplateOutlet } from '@angular/common'
import { ProjectWebUserModel } from '@entities/shared'
import { StandaloneDatePipe, TimeDifferenceFromNowPipe } from '@shared/pipes'
import { injectUiStore } from '@overlays/ui-store/data-access'

@Component({
	selector: 'app-project-member-item',
	standalone: true,
	imports: [
		InputSvgComponent,
		NgIf,
		NgOptimizedImage,
		TimeDifferenceFromNowPipe,
		StandaloneDatePipe,
		NgTemplateOutlet,
	],
	templateUrl: './project-member-item.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMemberItemComponent {
	private _uiStore = injectUiStore()

	@Input({ required: true }) member!: ProjectWebUserModel
	@Input({ required: true }) memberIsCurrentUser = false

	@Output() memberOptionsDialogOpened = new EventEmitter<ProjectWebUserModel>()

	openMemberOptionsDialog() {
		console.log('openMemberOptionsDialog')
		this.memberOptionsDialogOpened.emit(this.member)
		/*		this._uiStore.dispatch.openDialog({
		 component: DIALOG_COMPONENT.PROJECT_MEMBER_OPTIONS,
		 data: {

		 member: this.member,
		 }
		 })*/
	}
}
