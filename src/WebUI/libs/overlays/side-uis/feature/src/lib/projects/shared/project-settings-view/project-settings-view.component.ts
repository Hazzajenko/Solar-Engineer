import { ChangeDetectionStrategy, Component, computed, inject, Input } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ProjectWebModel } from '@entities/shared'
import { injectAppUser } from '@auth/data-access'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { LetDirective } from '@ngrx/component'
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common'
import { TruncatePipe } from '@shared/pipes'
import { SideUiViewHeadingComponent } from '../../../shared'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { InputSvgComponent, SpinnerComponent } from '@shared/ui'
import { MatButtonModule } from '@angular/material/button'
import { MatTooltipModule } from '@angular/material/tooltip'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { injectProjectsStore } from '@entities/data-access'
import { SideUiNavBarStore } from '../../../side-ui-nav-bar/side-ui-nav-bar.store'

@Component({
	selector: 'app-project-settings-view',
	standalone: true,
	imports: [
		AuthWebUserAvatarComponent,
		LetDirective,
		NgForOf,
		TruncatePipe,
		NgIf,
		NgStyle,
		NgClass,
		SideUiViewHeadingComponent,
		MatFormFieldModule,
		MatInputModule,
		ReactiveFormsModule,
		InputSvgComponent,
		SpinnerComponent,
		MatButtonModule,
		MatTooltipModule,
	],
	templateUrl: './project-settings-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectSettingsViewComponent {
	private _uiStore = injectUiStore()
	private _projectsStore = injectProjectsStore()
	private _navBarStore = inject(SideUiNavBarStore)
	user = injectAppUser()
	@Input({ required: true }) project!: ProjectWebModel

	currentMember = computed(() => {
		const user = this.user()
		if (!user) return
		return this.project.members.find((m) => m.id === user.id)
	})

	canDeleteProject = computed(() => {
		const currentMember = this.currentMember()
		if (!currentMember) return false
		return currentMember.role === 'Owner'
	})

	leaveProject() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.WARNING_TEMPLATE,
			data: {
				title: `Leave Project ${this.project.name}`,
				message: 'Are you sure you want to leave this project?',
				buttonText: 'Leave',
				buttonAction: () => {
					this._projectsStore.dispatch.leaveProject(this.project.id)
					this._navBarStore.changeView('projects')
				},
			},
		})
	}

	deleteProject() {
		if (!this.canDeleteProject()) {
			throw new Error('Cannot delete project')
		}
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.WARNING_TEMPLATE,
			data: {
				title: `Delete Project ${this.project.name}`,
				message: 'Are you sure you want to delete this project?',
				buttonText: 'Delete',
				buttonAction: () => {
					this._projectsStore.dispatch.deleteProject(this.project.id)
					this._navBarStore.changeView('projects')
				},
			},
		})
		/*		this._uiStore.dispatch.openDialog({
		 component: DIALOG_COMPONENT.DELETE_PROJECT_WARNING,
		 data: { projectId: this.project.id },
		 })*/
	}
}
