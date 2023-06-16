import { ChangeDetectionStrategy, Component, computed, inject, Injector } from '@angular/core'
import { ContextMenuInput, ContextMenuProjectMenu, DIALOG_COMPONENT, injectUiStore, uiFeature } from '@overlays/ui-store/data-access'
import { contextMenuInputInjectionToken } from '../context-menu-renderer'
import { injectProjectsStore, selectAllProjects, selectProjectById, selectProjectsEntities } from '@entities/data-access'
import { ProjectModel, ProjectWebModel, ProjectWebUserModel } from '@entities/shared'
import { ChildContextMenuDirective, ContextMenuDirective } from '../directives'
import { LetDirective } from '@ngrx/component'
import { NgClass, NgForOf, NgIf, NgOptimizedImage, NgStyle } from '@angular/common'
import { InputSvgComponent, ShowSvgComponent, ShowSvgNoStylesComponent } from '@shared/ui'
import { increaseScaleAndOpacity } from '@shared/animations'
import { createSelector } from '@ngrx/store'
import { Dictionary } from '@ngrx/entity'
import { assertNotNull, selectSignalFromStore } from '@shared/utils'
import { TAILWIND_COLOUR_500_VALUES, TailwindColor500 } from '@shared/data-access/models'
import { injectAppUser, selectAllFriends, selectUsersEntities } from '@auth/data-access'
import { WebUserModel } from '@auth/shared'
import { notification } from '@tauri-apps/api'
import { ContextMenuBaseComponent, ContextMenuExpandComponent, ContextMenuHeadingComponent, ContextMenuItemComponent, ContextMenuSubHeadingComponent } from '../context-menu-builder'

/*export const selectProjectByContextMenuData = createSelector(
 uiFeature.selectCurrentContextMenu,
 selectProjectsEntities,
 (contextMenuInput: ContextMenuInput | undefined, projects: Dictionary<ProjectModel>) => {
 if (!contextMenuInput) return undefined
 if (!('projectId' in contextMenuInput.data)) return undefined
 return projects[contextMenuInput.data.projectId]
 },
 )*/

// projectByIdWithProjectWebUsers
@Component({
	selector: 'context-menu-project',
	standalone: true,
	imports: [
		ContextMenuDirective,
		LetDirective,
		NgIf,
		ShowSvgComponent,
		ShowSvgNoStylesComponent,
		NgForOf,
		NgClass,
		NgStyle,
		NgOptimizedImage,
		InputSvgComponent,
		ChildContextMenuDirective,
		ContextMenuItemComponent,
		ContextMenuExpandComponent,
		ContextMenuBaseComponent,
		ContextMenuHeadingComponent,
		ContextMenuSubHeadingComponent,
	],
	templateUrl: './context-menu-project.component.html',
	styles: [],
	animations: [increaseScaleAndOpacity],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuProjectComponent {
	private _projectsStore = injectProjectsStore()
	private _uiStore = injectUiStore()
	contextMenu = inject(Injector).get(contextMenuInputInjectionToken) as ContextMenuProjectMenu
	user = injectAppUser()
	project = selectSignalFromStore(selectWebProjectByIdByContextMenuData)
	friendsArentInProject = selectSignalFromStore(
		selectUserFriendsThatArentInProject({ memberIds: this.project()?.memberIds ?? [] }),
	)

	vm = computed(() => {
		const user = this.user()
		const project = this.project()
		if (!project || !user) return undefined
		const isProjectOwner = project.createdById === user.id
		return {
			user,
			project,
			isProjectOwner,
		}
	})

	protected readonly TAILWIND_COLOUR_500_VALUES = TAILWIND_COLOUR_500_VALUES
	protected readonly notification = notification

	setProjectColour(colour: TailwindColor500) {
		const project = this.project()
		assertNotNull(project)
		this._projectsStore.dispatch.updateProject({
			id: project.id,
			changes: { colour },
		})
	}

	deleteProject() {
		const project = this.project()
		assertNotNull(project)
		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.DELETE_PROJECT_WARNING,
			data: { projectId: project.id },
		})
		this._uiStore.dispatch.closeContextMenu()
	}

	openInviteToProjectConfirmDialog(friendNotInProject: WebUserModel) {
		const project = this.project()
		assertNotNull(project)

		this._uiStore.dispatch.openDialog({
			component: DIALOG_COMPONENT.INVITE_TO_PROJECT_CONFIRM,
			data: {
				projectId: project.id,
				userIdToInvite: friendNotInProject.id,
			},
		})
		this._uiStore.dispatch.closeContextMenu()
	}
}

export const selectProjectByContextMenuData = createSelector(
	uiFeature.selectCurrentContextMenu,
	selectProjectsEntities,
	(contextMenuInput: ContextMenuInput | undefined, projects: Dictionary<ProjectModel>) => {
		if (!contextMenuInput) return undefined
		if (!('projectId' in contextMenuInput.data)) return undefined
		return projects[contextMenuInput.data.projectId]
	},
)

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

export const selectAllWebProjectsExcludeUserFromMembers = (props: { appUserId: string }) =>
	createSelector(
		selectAllProjects,
		selectUsersEntities,
		(projects: ProjectModel[], users: Dictionary<WebUserModel>) =>
			projects.map((project) => {
				const projectWebUsers = project.members
					.filter((member) => member.id !== props.appUserId)
					.map((member) => {
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

export const selectWebProjectByIdExcludeUserFromMembers = (props: {
	projectId: string
	appUserId: string
}) =>
	createSelector(
		selectProjectById({ id: props.projectId }),
		selectUsersEntities,
		(project: ProjectModel | undefined, users: Dictionary<WebUserModel>) => {
			if (!project) return undefined
			const projectWebUsers = project.members
				.filter((member) => member.id !== props.appUserId)
				.map((member) => {
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

export const selectWebProjectByIdByContextMenuData = createSelector(
	uiFeature.selectCurrentContextMenu,
	selectProjectsEntities,
	selectUsersEntities,
	(
		contextMenuInput: ContextMenuInput | undefined,
		projects: Dictionary<ProjectModel>,
		users: Dictionary<WebUserModel>,
	) => {
		if (!contextMenuInput) return undefined
		if (!('projectId' in contextMenuInput.data)) return undefined
		const project = projects[contextMenuInput.data.projectId]
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

export const selectUserFriendsThatArentInProject = (props: { memberIds: string[] }) =>
	createSelector(selectAllFriends, (friends: WebUserModel[]) => {
		if (!friends) return undefined
		return friends.filter((friend) => !props.memberIds.includes(friend.id))
	})
