import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, switchMap, tap } from 'rxjs'
import { ProjectsActions, ProjectsLocalStorageService } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { fetchProjectTemplateData } from '@entities/shared'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'
import { injectNotificationsStore } from '@overlays/notifications/data-access'

export const initLocalStorageProject$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsLocalStorage = inject(ProjectsLocalStorageService),
		uiStore = injectUiStore(),
		notificationsStore = injectNotificationsStore(),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signInAsGuest),
			map(() => {
				if (!projectsLocalStorage.isProjectExisting()) {
					return ProjectsActions.noop()
				}
				const localStorageProject = projectsLocalStorage.fetchExistingProject()
				return ProjectsActions.initLocalStorageProject({ localStorageProject })
			}),
			tap((action) => {
				if (action.type === '[Projects Store] Init Local Storage Project') {
					notificationsStore.dispatch.addLocalNotification({
						id: 'initLocalStorageProject',
					})
				}
				projectsLocalStorage.initNewProject()
				setTimeout(() => {
					uiStore.dispatch.openDialog({
						component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
					})
				}, 500)
			}),
		)
	},
	{ functional: true },
)

export const loadProjectTemplate$ = createEffect(
	(actions$ = inject(Actions), projectsLocalStorage = inject(ProjectsLocalStorageService)) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadProjectTemplate),
			switchMap(({ templateName }) => fetchProjectTemplateData(templateName)),
			map((projectEntities) => {
				// const projectData = fetchProjectTemplateData(templateName)
				// const projectData = PROJECT_TEMPLATE_DATA[templateName]
				return ProjectsActions.loadProjectSuccess({ projectEntities })
			}),
			tap(({ projectEntities }) => {
				projectsLocalStorage.setProjectEntities(projectEntities)
			}),
		)
	},
	{ functional: true },
)
