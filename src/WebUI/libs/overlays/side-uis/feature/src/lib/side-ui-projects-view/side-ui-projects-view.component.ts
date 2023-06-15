import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import {
	NgClass,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import {
	injectAuthStore,
	selectAllUsersMappedWithConnections,
	selectUsersEntities,
} from '@auth/data-access'
import {
	injectProjectsStore,
	selectAllProjects,
	selectProjectsEntities,
} from '@entities/data-access'
import { ProjectId, ProjectModel, ProjectWebModel, ProjectWebUserModel } from '@entities/shared'
import {
	CONTEXT_MENU_COMPONENT,
	DIALOG_COMPONENT,
	injectUiStore,
} from '@overlays/ui-store/data-access'
import { InputSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { TruncatePipe } from '@shared/pipes'
import { ContextMenuModule } from 'primeng/contextmenu'
import { createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { WebUserModel } from '@auth/shared'
import { getTimeDifferenceFromNow, pluralize, selectSignalFromStore } from '@shared/utils'
import { AccordionModule } from 'primeng/accordion'
import { LetDirective } from '@ngrx/component'
import { heightInOutWithConfig } from '@shared/animations'
import { AuthWebUserAvatarComponent } from '@auth/ui'
import { SideUiBaseComponent } from '../side-ui-base/side-ui-base.component'
import { DefaultHoverEffectsDirective } from '@shared/directives'

export const selectAllWebProjects = createSelector(
	selectAllProjects,
	selectAllUsersMappedWithConnections,
	(projects: ProjectModel[], users: WebUserModel[]) =>
		projects.map((project) => {
			const projectWebUsers = project.members.map((member) => {
				const webUser = users.find((user) => user.id === member.id)
				if (!webUser) {
					console.error(`Web user with id ${member.id} not found`)
					throw new Error(`Web user with id ${member.id} not found`)
				}
				return { ...member, ...webUser } as ProjectWebUserModel
			})
			return { ...project, members: projectWebUsers } as ProjectWebModel
		}),
)

export const selectWebProjectByIdByClickMenu = (props: { projectId: string }) =>
	createSelector(
		selectProjectsEntities,
		selectUsersEntities,
		(projects: Dictionary<ProjectModel>, users: Dictionary<WebUserModel>) => {
			const project = projects[props.projectId]
			if (!project) return undefined
			const projectWebUsers = project.members.map((member) => {
				const webUser = users[member.id]
				if (!webUser) {
					console.error(`Web user with id ${member.id} not found`)
					throw new Error(`Web user with id ${member.id} not found`)
				}
				return { ...member, ...webUser } as ProjectWebUserModel
			})
			return { ...project, members: projectWebUsers } as ProjectWebModel
		},
	)

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
		ContextMenuModule,
		AccordionModule,
		LetDirective,
		NgOptimizedImage,
		AuthWebUserAvatarComponent,
		SideUiBaseComponent,
		InputSvgComponent,
		DefaultHoverEffectsDirective,
	],
	templateUrl: './side-ui-projects-view.component.html',
	styles: [],
	animations: [heightInOutWithConfig(0.1)],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideUiProjectsViewComponent {
	private _auth = injectAuthStore()
	private _projects = injectProjectsStore()
	private _uiStore = injectUiStore()
	user = this._auth.select.user
	projects = selectSignalFromStore(selectAllWebProjects)
	selectedProject = this._projects.select.selectedProject
	openedProjects = signal<Map<ProjectId, boolean>>(new Map())

	vm = computed(() => {
		const projects = this.projects().sort(
			(a, b) => new Date(b.lastModifiedTime).getTime() - new Date(a.lastModifiedTime).getTime(),
		)
		return {
			projects,
			selectedProject: this.selectedProject(),
			openedProjects: this.openedProjects(),
		}
	})
	protected readonly pluralize = pluralize
	protected readonly getTimeDifferenceFromNow = getTimeDifferenceFromNow

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
