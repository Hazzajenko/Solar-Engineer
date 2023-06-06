import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common'
import { injectAuthStore } from '@auth/data-access'
import { injectProjectsStore } from '@entities/data-access'
import { ProjectId, ProjectModel } from '@entities/shared'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { TruncatePipe } from '@shared/pipes'

@Component({
	selector: 'side-ui-projects-view',
	standalone: true,
	imports: [
		NgIf,
		NgForOf,
		NgClass,
		NgStyle,
		ShowSvgNoStylesComponent,
		NgTemplateOutlet,
		TruncatePipe,
	],
	templateUrl: './side-ui-projects-view.component.html',
	styles: [],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiProjectsViewComponent {
	private _auth = injectAuthStore()
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	user = this._auth.select.user
	projects = this._projects.select.allProjects
	selectedProject = this._projects.select.selectedProject
	openedProjects = signal<Map<ProjectId, boolean>>(new Map())

	selectProject(project: ProjectModel) {
		if (this.selectedProject()?.id === project.id) return
		this._projects.dispatch.selectProject(project.id)
	}

	createProject() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.CREATE_PROJECT,
		})
	}

	toggleProjectView(project: ProjectModel) {
		const id = project.id
		this.openedProjects.set(new Map(this.openedProjects()).set(id, !this.openedProjects().get(id)))
	}

	openProjectContextMenu(event: MouseEvent, project: ProjectModel) {
		this._uiStore.dispatch.openContextMenu({
			component: CONTEXT_MENU_COMPONENT.PROJECT_MENU,
			data: { projectId: project.id },
			location: { x: event.clientX, y: event.clientY },
		})
	}

	openSignInDialog() {
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.SIGN_IN,
		})
	}
}
