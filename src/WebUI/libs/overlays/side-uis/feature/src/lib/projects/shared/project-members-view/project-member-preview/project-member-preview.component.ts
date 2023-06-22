import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { ProjectWebUserModel } from '@entities/shared'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { LetDirective } from '@ngrx/component'
import { NgIf } from '@angular/common'
import { TruncatePipe } from '@shared/pipes'
import { WebUserModel } from '@auth/shared'
import { ButtonAnimatedDownUpArrowComponent, ButtonContextMenuComponent } from '@shared/ui'

@Component({
	selector: 'app-project-member-preview',
	standalone: true,
	imports: [
		AuthWebUserAvatarComponent,
		LetDirective,
		NgIf,
		TruncatePipe,
		ButtonAnimatedDownUpArrowComponent,
		ButtonContextMenuComponent,
	],
	templateUrl: './project-member-preview.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMemberPreviewComponent {
	@Input({ required: true }) member!: ProjectWebUserModel
	@Input({ required: true }) memberIsCurrentUser = false
	@Input({ required: true }) isOpen = false

	@Output() readonly memberViewToggle = new EventEmitter<WebUserModel['id']>()
	@Output() readonly memberContextMenuOpen = new EventEmitter<MouseEvent>()

	toggleMemberView() {
		this.memberViewToggle.emit(this.member.id)
	}

	openMemberContextMenu(event: MouseEvent) {
		this.memberContextMenuOpen.emit(event)
	}
}
