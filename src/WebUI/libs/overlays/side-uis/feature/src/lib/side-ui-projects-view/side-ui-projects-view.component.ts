import { ChangeDetectionStrategy, Component, computed, Signal, signal } from '@angular/core'
import {
	NgClass,
	NgForOf,
	NgIf,
	NgOptimizedImage,
	NgStyle,
	NgTemplateOutlet,
} from '@angular/common'
import { injectAuthStore, selectUsersEntities } from '@auth/data-access'
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
import { ShowSvgNoStylesComponent } from '@shared/ui'
import { TruncatePipe } from '@shared/pipes'
import { MenuItem } from 'primeng/api'
import { ContextMenuModule } from 'primeng/contextmenu'
import { TAILWIND_COLOUR_500_VALUES } from '@shared/data-access/models'
import { createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { WebUserModel } from '@auth/shared'
import { selectSignalFromStore } from '@shared/utils'
import { AccordionModule } from 'primeng/accordion'
import { LetDirective } from '@ngrx/component'
import { heightInOutWithConfig } from '@shared/animations'

export const selectAllWebProjects = createSelector(
	selectAllProjects,
	selectUsersEntities,
	(projects: ProjectModel[], users: Dictionary<WebUserModel>) =>
		projects.map((project) => {
			const projectWebUsers = project.members.map((member) => {
				const webUser = users[member.id]
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
	// projects = this._projects.select.allProjects
	selectedProject = this._projects.select.selectedProject
	openedProjects = signal<Map<ProjectId, boolean>>(new Map())
	openedProjId = signal<string>(this.projects()[0].id)
	openProj: Signal<ProjectWebModel | undefined> = selectSignalFromStore(
		selectWebProjectByIdByClickMenu({ projectId: this.openedProjId() }),
	)

	getProjectWebMembers = (project: ProjectModel) => {
		return this.projects().find((proj) => proj.id === project.id)?.members as ProjectWebUserModel[]
	}

	projectWebMembers = computed(() => {
		const project = this.openProj()
		if (!project) return [] as MenuItem[]
		return project.members.map(
			(member: ProjectWebUserModel) =>
				({
					label: member.displayName,
					badge: member.photoUrl, //
					// icon: 'pi pi-user',
				} as MenuItem),
		) as MenuItem[]
	})

	items: MenuItem[] = [
		{
			label: 'Create Project',
			icon: 'pi pi-plus',
			command: () => this.createProject(),
		},
		{
			label: 'Open Project',
			icon: 'pi pi-folder-open',

			// command: () => this._uiStore.dispatch.openDialog({ component: DIALOG_COMPONENT.OPEN_PROJECT }),
			items: [
				{
					label: 'Project 1',
					icon: 'pi pi-folder', // command: () => this.selectProject({ id: '1', name: 'Project 1' }),
				},
				{
					label: 'Project 2',
					icon: 'pi pi-folder',
				},
			],
		},
		{
			label: 'Delete Project',
			icon: 'pi pi-trash', // command: () => this._uiStore.dispatch.openDialog({ component: DIALOG_COMPONENT.DELETE_PROJECT }),
		},
		{
			label: 'Sign In',
			icon: 'pi pi-sign-in', // command: () => this.openSignInDialog(),
		},
	]

	projectContextMenuItems: MenuItem[] = [
		{
			label: 'Open Project',
			icon: 'pi pi-folder-open', // command: (event) => this.selectProject(event.item.data.project),
		},
		{
			label: 'Edit Project Colour',
			icon: 'pi pi-palette',
			items: [
				...TAILWIND_COLOUR_500_VALUES.map((colour) => ({
					label: colour,
					style: { color: colour, width: '100px' },
					iconStyle: { color: colour },
					icon: 'pi pi-circle-on',
				})),
			],
		},
		{
			label: 'Project Members',
			icon: 'pi pi-users',
			items: [...this.projectWebMembers()],
		},
		{
			label: 'Delete Project',
			icon: 'pi pi-trash', // command: (event) => this.deleteProject(event.item.data.project),
		},
		{
			label: 'Rename Project',
			icon: 'pi pi-pencil', // command: (event) => this.renameProject(event.item.data.project),
		},
		{
			label: 'Duplicate Project',
			icon: 'pi pi-copy', // command: (event) => this.duplicateProject(event.item.data.project),
		},
		{
			label: 'Export Project',
			icon: 'pi pi-external-link', // command: (event) => this.exportProject(event.item.data.project),
		},
		{
			label: 'Close Project',
			icon: 'pi pi-times', // command: (event) => this.closeProject(event.item.data.project),
		},
	]

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
