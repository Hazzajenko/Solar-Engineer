import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { catchError, map, of, tap } from 'rxjs'
import { ProjectsSignalrService } from '../services'
import { ProjectsActions } from './projects.actions'
import { injectEntityStore, selectProjectById } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { Store } from '@ngrx/store'

export const createProjectSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.createProjectSignalr),
			tap(({ request }) => projectsSignalr.createProject(request)),
		)
	},
	{ functional: true, dispatch: false },
)

export const initProjectsSignalr$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService), // panelsSignalr = inject(PanelsSignalrService),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signInSuccess),
			tap(({ token }) => {
				projectsSignalr.init(token)
				// const hubConnection = projectsSignalr.init(token)
				// panelsSignalr.init(hubConnection)
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
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.deleteProject),
			tap(({ projectId }) => projectsSignalr.deleteProject(projectId)),
		)
	},
	{ functional: true, dispatch: false },
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

export const leaveProject$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.leaveProject),
			tap(({ projectId }) => projectsSignalr.leaveProject({ projectId })),
		)
	},
	{ functional: true, dispatch: false },
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

/*
 export const mapProjectUsersToWebUsers$ = createEffect(
 (
 actions$ = inject(Actions),
 { mapProjectUsersToWebUsers } = injectMapProjectUsersToWebUsersFactory(),
 ) => {
 return actions$.pipe(ofType(ProjectsActions.loadUserProjects), mapProjectUsersToWebUsers())
 },
 { functional: true, dispatch: false },
 )
 */

/*export const mapProjectUsersToWebUsers$ = createEffect(
 (actions$ = inject(Actions), store = inject(Store), http = inject(HttpClient)) => {
 return actions$.pipe(
 ofType(ProjectsActions.loadUserProjects),
 switchMap(({ projects }) => {
 const projectsWithInStoreWebUsers = projects.map((project) => {
 return store.select(selectUsersByIdArray({ ids: project.memberIds })).pipe(
 map((webUsers) => {
 const projectWebUsers = webUsers.map((webUser) => {
 const existingProjectUser = project.members.find(
 (projectMember) => projectMember.id === webUser.id,
 )
 return {
 ...existingProjectUser,
 ...webUser,
 } as ProjectWebUserModel
 })
 return {
 ...project,
 members: projectWebUsers,
 }
 }),
 )
 })
 return forkJoin(projectsWithInStoreWebUsers)
 }),
 switchMap((projects) => {
 const projectsWithMissingWebUsers = projects.filter((project) => {
 return project.memberIds.filter(
 (id) => !project.members.find((member) => member.id === id),
 )
 })
 const projectsWithInStoreWebUsers = projects.filter((project) => {
 return !projectsWithMissingWebUsers.find((proj) => proj.id === project.id)
 })
 if (projectsWithMissingWebUsers.length === 0) return of(projectsWithInStoreWebUsers)
 const webMembersIdsNotLoaded = projectsWithMissingWebUsers.map(
 (project) => project.memberIds,
 )
 const appUserIds = webMembersIdsNotLoaded.reduce((acc, curr) => [...acc, ...curr], [])
 if (appUserIds.length === 0) return of(projectsWithInStoreWebUsers)
 const projectsWithFetchedWebUsers = of(projectsWithMissingWebUsers).pipe(
 switchMap((projects) => {
 const projectsWithInStoreWebUsers = projects.map((project) => {
 return http
 .get<{
 appUsers: WebUserModel[]
 }>('/auth/users', { params: { appUserIds } })
 .pipe(
 tap((res) => console.log(res)),
 map(({ appUsers }) => {
 const members = project.members.map((projectWebUser) => {
 const webUser = appUsers.find((appUser) => appUser.id === projectWebUser.id)
 if (!webUser) return projectWebUser
 return {
 ...webUser,
 ...projectWebUser,
 }
 })
 return { ...project, members }
 }),
 )
 })
 return forkJoin(projectsWithInStoreWebUsers)
 }),
 )
 return combineLatest([of(projectsWithInStoreWebUsers), projectsWithFetchedWebUsers]).pipe(
 map(([projectsWithInStoreWebUsers, projectsWithFetchedWebUsers]) => {
 return [...projectsWithInStoreWebUsers, ...projectsWithFetchedWebUsers]
 }),
 )
 }),
 tap((res) => console.log(res)),
 )
 },
 { functional: true, dispatch: false },
 )*/

export const selectUserProjectOnLoad$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsSignalr = inject(ProjectsSignalrService),
		uiStore = injectUiStore(),
	) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadUserProjectsSuccess),
			map(({ projects }) => {
				if (projects.length > 0) {
					return ProjectsActions.selectProjectInitial({ projectId: projects[0].id })
				}
				return ProjectsActions.userProjectsEmpty()
			}),
			tap((action) => {
				if (action.type === ProjectsActions.selectProjectInitial.type) {
					projectsSignalr.getProjectById(action.projectId, true)
					return
				}
				uiStore.dispatch.openDialog({
					component: DIALOG_COMPONENT.CREATE_PROJECT,
				})
			}),
		)
	},
	{ functional: true },
)

export const fetchProjectDataOnSelection$ = createEffect(
	(
		actions$ = inject(Actions),
		entitiesStore = injectEntityStore(),
		projectsSignalr = inject(ProjectsSignalrService),
	) => {
		return actions$.pipe(
			ofType(ProjectsActions.selectProject),
			tap(({ projectId }) => {
				entitiesStore.strings.dispatch.clearStringsState()
				entitiesStore.panels.dispatch.clearPanelsState()
				entitiesStore.panelLinks.dispatch.clearPanelLinksState()
				entitiesStore.panelConfigs.dispatch.clearPanelConfigsState()
				projectsSignalr.getProjectById(projectId)
			}),
		)
	},
	{ functional: true, dispatch: false },
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
