import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, tap } from 'rxjs'
import { ProjectsSignalrService } from '../services'
import { ProjectsActions } from './projects.actions'
import { injectEntityStore } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'

export const createProjectSignalr$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.createProjectSignalr),
			tap((request) => projectsSignalr.createProject(request)),
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
			tap(({ projectId }) => projectsSignalr.acceptProjectInvite(projectId)),
		)
	},
	{ functional: true, dispatch: false },
)

export const rejectProjectInvite$ = createEffect(
	(actions$ = inject(Actions), projectsSignalr = inject(ProjectsSignalrService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.rejectProjectInvite),
			tap(({ projectId }) => projectsSignalr.rejectProjectInvite(projectId)),
		)
	},
	{ functional: true, dispatch: false },
)
