import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { LetDirective } from '@ngrx/component'
import { NgForOf, NgIf } from '@angular/common'
import { ProjectWebModel, ProjectWebUserModel } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'
import { TruncatePipe } from '@shared/pipes'
import { SideUiViewHeadingComponent } from '../../../shared'
import { ProjectMemberPreviewComponent } from './project-member-preview/project-member-preview.component'
import { ProjectMemberItemComponent } from './project-member-item/project-member-item.component'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { assertNotNull } from '@shared/utils'

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
		ProjectMemberPreviewComponent,
		ProjectMemberItemComponent,
	],
	templateUrl: './project-members-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectMembersViewComponent {
	private _uiStore = injectUiStore()

	user = injectAppUser()

	@Input({ required: true }) project!: ProjectWebModel

	openedMembers = signal<Set<string>>(new Set())

	openMemberView(memberId: string) {
		const openedMembers = this.openedMembers()
		if (openedMembers.has(memberId)) {
			openedMembers.delete(memberId)
			this.openedMembers.set(openedMembers)
			return
		}

		openedMembers.add(memberId)
		this.openedMembers.set(openedMembers)
	}

	openMemberContextMenu(event: MouseEvent, member: ProjectWebUserModel) {
		console.log('openMemberContextMenu', event, member)
	}

	openMemberOptionsDialog(member: ProjectWebUserModel) {
		console.log('openMemberOptionsDialog', member)
		const user = this.user()
		assertNotNull(user)
		const currentUserMember = this.project.members.find((member) => member.id === user.id)
		assertNotNull(currentUserMember)
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.PROJECT_MEMBER_OPTIONS,
			data: {
				project: this.project,
				member,
				currentUserMember,
			},
		})
	}
}
