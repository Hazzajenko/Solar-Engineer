import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { catchError, EMPTY, map, of, switchMap, tap } from 'rxjs'
import { ProjectsHttpService, ProjectsSignalrService } from '../services'
import { ProjectsActions } from './projects.actions'
import { injectEntityStore, injectProjectsStore, selectProjectById } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { DIALOG_COMPONENT, UiActions } from '@overlays/ui-store/data-access'
import { Store } from '@ngrx/store'
import { ProjectEntities } from '@entities/shared'

export const createProjectHttp$ = createEffect(
	(actions$ = inject(Actions), projectsHttp = inject(ProjectsHttpService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.createProjectSignalr),
			switchMap(({ request }) => projectsHttp.createProject(request)),
			map((response) => ProjectsActions.createProjectSuccess({ response })),
			catchError((error) => {
				console.error(error)
				return EMPTY
			}),
		)
	},
	{ functional: true },
)

export const loadProjectOnCreateSuccess$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ProjectsActions.createProjectSuccess),
			map(({ response }) => {
				const { panels, strings, panelLinks, panelConfigs } = response.project
				const projectEntities: ProjectEntities = {
					panels,
					strings,
					panelLinks,
					panelConfigs,
				}
				return ProjectsActions.loadProjectSuccess({ projectEntities })
			}),
		)
	},
	{ functional: true },
)

export const initProjectsSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => {
				projectsSignalr.init(token)
			}),
		)
	},
	{ functional: true, dispatch: false },
)

export const updateProjectSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.updateProject),
			tap(({ update }) => projectsSignalr.updateProject(update)),
		)
	},
	{ functional: true, dispatch: false },
)

export const deleteProjectSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		projectsStore = injectProjectsStore(),
	) => {
		return actions$.pipe(
			ofType(ProjectsActions.deleteProject, ProjectsActions.leaveProject),
			tap((action) => {
				const projectId = action.projectId
				if (action.type === ProjectsActions.deleteProject.type) {
					projectsSignalr.deleteProject(projectId)
					return
				}
				projectsSignalr.leaveProject({ projectId })
			}),
			map(({ projectId }) => {
				const projects = projectsStore.select.allProjects()
				const projectsExceptDeleted = projects.filter((project) => project.id !== projectId)
				if (projectsExceptDeleted.length === 0) {
					return UiActions.openDialog({
						dialog: {
							component: DIALOG_COMPONENT.CREATE_PROJECT,
						},
					})
				}
				return ProjectsActions.selectProject({ projectId: projectsExceptDeleted[0].id })
			}),
		)
	},
	{ functional: true },
)

export const userAcceptedInviteToProject$ = createEffect(
	(actions$ = inject(Actions), store = inject(Store)) => {
		return actions$.pipe(
			ofType(ProjectsActions.userAcceptedInviteToProject),
			map(({ response }) => {
				const projectToUpdate = store.selectSignal(selectProjectById({ id: response.projectId }))()
				if (!projectToUpdate) {
					throw new Error(`Project not found, ${response.projectId}`)
				}
				const memberIds = projectToUpdate.memberIds.concat(response.member.id)
				const members = projectToUpdate.members.concat(response.member)
				return ProjectsActions.updateProjectNoSignalr({
					update: { id: projectToUpdate.id, changes: { memberIds, members } },
				})
			}),
			catchError((error) => {
				console.error(error)
				return of(ProjectsActions.getProjectFailure({ error }))
			}),
		)
	},
	{ functional: true },
)

export const updateProjectMember$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.updateProjectMember),
			tap(({ request }) => projectsSignalr.updateProjectMember(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const projectMemberUpdated$ = createEffect(
	(actions$ = inject(Actions), store = inject(Store)) => {
		return actions$.pipe(
			ofType(ProjectsActions.updateProjectMemberNoSignalr),
			map(({ response }) => {
				const projectToUpdate = store.selectSignal(selectProjectById({ id: response.projectId }))()
				if (!projectToUpdate) {
					throw new Error(`Project not found, ${response.projectId}`)
				}
				const memberChanges = response.changes
				const members = projectToUpdate.members.map((member) => {
					if (member.id === response.memberId) {
						return {
							...member,
							...memberChanges,
						}
					}
					return member
				})
				return ProjectsActions.updateProjectNoSignalr({
					update: { id: projectToUpdate.id, changes: { members } },
				})
			}),
			catchError((error) => {
				console.error(error)
				return of(ProjectsActions.getProjectFailure({ error }))
			}),
		)
	},
	{ functional: true },
)

export const kickProjectMember$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.kickProjectMember),
			tap(({ request }) => projectsSignalr.kickProjectMember(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const projectMemberKicked$ = createEffect(
	(actions$ = inject(Actions), store = inject(Store)) => {
		return actions$.pipe(
			ofType(ProjectsActions.projectMemberKicked),
			map(({ response }) => {
				const projectToUpdate = store.selectSignal(selectProjectById({ id: response.projectId }))()
				if (!projectToUpdate) {
					throw new Error(`Project not found, ${response.projectId}`)
				}
				const memberIds = projectToUpdate.memberIds.filter((id) => id !== response.memberId)
				const members = projectToUpdate.members.filter((member) => member.id !== response.memberId)
				return ProjectsActions.updateProjectNoSignalr({
					update: { id: projectToUpdate.id, changes: { memberIds, members } },
				})
			}),
			catchError((error) => {
				console.error(error)
				return of(ProjectsActions.getProjectFailure({ error }))
			}),
		)
	},
	{ functional: true },
)

export const userLeftProject$ = createEffect(
	(actions$ = inject(Actions), store = inject(Store)) => {
		return actions$.pipe(
			ofType(ProjectsActions.userLeftProject),
			map(({ response }) => {
				const { projectId, userId } = response
				const projectToUpdate = store.selectSignal(selectProjectById({ id: projectId }))()
				if (!projectToUpdate) {
					throw new Error(`Project not found, ${projectId}`)
				}
				const memberIds = projectToUpdate.memberIds.filter((id) => id !== userId)
				const members = projectToUpdate.members.filter((member) => member.id !== userId)
				return ProjectsActions.updateProjectNoSignalr({
					update: { id: projectToUpdate.id, changes: { memberIds, members } },
				})
			}),
			catchError((error) => {
				console.error(error)
				return of(ProjectsActions.getProjectFailure({ error }))
			}),
		)
	},
	{ functional: true },
)

export const selectUserProjectOnLoad$ = createEffect(
	(actions$ = inject(Actions), projectsHttp = inject(ProjectsHttpService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadUserProjectsSuccess),
			switchMap(({ projects, selectedProjectId }) => {
				if (projects.length > 0) {
					const projectIdToSelect = selectedProjectId || projects[0].id
					return projectsHttp.getProjectById(projectIdToSelect).pipe(
						map((response) => ProjectsActions.getProjectSuccess({ response })),
						catchError((error) => {
							console.error(error)
							return of(ProjectsActions.getProjectFailure({ error }))
						}),
					)
				}
				return of(
					UiActions.openDialog({
						dialog: { component: DIALOG_COMPONENT.CREATE_PROJECT },
					}),
				)
			}),
		)
	},
	{ functional: true },
)

export const fetchProjectDataOnSelection$ = createEffect(
	(
		actions$ = inject(Actions),
		entitiesStore = injectEntityStore(),
		projectsHttp = inject(ProjectsHttpService),
	) => {
		return actions$.pipe(
			ofType(ProjectsActions.selectProject),
			tap(() => {
				entitiesStore.strings.dispatch.clearStringsState()
				entitiesStore.panels.dispatch.clearPanelsState()
				entitiesStore.panelLinks.dispatch.clearPanelLinksState()
				entitiesStore.panelConfigs.dispatch.clearPanelConfigsState()
				// projectsSignalr.getProjectById(projectId)
			}),
			switchMap(({ projectId }) => {
				return projectsHttp.getProjectById(projectId).pipe(
					map((response) => ProjectsActions.getProjectSuccess({ response })),
					catchError((error) => {
						console.error(error)
						return of(ProjectsActions.getProjectFailure({ error }))
					}),
				)
			}),
		)
	},
	{ functional: true },
)

export const inviteUsersToProject$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.inviteUsersToProject),
			tap(({ request }) => projectsSignalr.inviteUsersToProject(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const acceptProjectInvite$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.acceptProjectInvite),
			tap(({ request }) => projectsSignalr.acceptProjectInvite(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const rejectProjectInvite$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.rejectProjectInvite),
			tap(({ request }) => projectsSignalr.rejectProjectInvite(request)),
		)
	},
	{ functional: true, dispatch: false },
)
