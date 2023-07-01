import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { catchError, EMPTY, map, switchMap, tap } from 'rxjs'
import { ProjectsActions, ProjectsLocalStorageService } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { fetchProjectTemplateData } from '@entities/shared'
import { injectUiStore } from '@overlays/ui-store/data-access'
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
			}) /*	tap((action) => {
	 if (action.type === '[Projects Store] Init Local Storage Project') {
	 // const localNotification = createLocalNotification.loadedLocalSave(
	 // 	action.localStorageProject.lastModifiedTime,
	 // )
	 const lastModifiedTime = getTimeDifferenceFromNow(
	 action.localStorageProject.lastModifiedTime,
	 'short',
	 true,
	 )
	 const dynamicNotification = createDynamicNotification({
	 title: 'Loaded Local Save',
	 subtitle: `Last Modified: ${lastModifiedTime}`,
	 photoUrl: undefined,
	 message: undefined,
	 actionButton: undefined,
	 dismissButton: {
	 text: 'Dismiss',
	 onClick: undefined,
	 },
	 })
	 notificationsStore.dispatch.addDynamicNotification(dynamicNotification)
	 // notificationsStore.dispatch.addLocalNotification(localNotification)
	 return
	 }
	 projectsLocalStorage.initNewProject()
	 setTimeout(() => {
	 uiStore.dispatch.openDialog({
	 component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
	 })
	 }, 500)
	 }),*/,
		)
	},
	{ functional: true },
)

export const initExistingLocalStorageProject$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsLocalStorage = inject(ProjectsLocalStorageService),
		notificationsStore = injectNotificationsStore(),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signInAsExistingGuest),
			map(() => {
				if (!projectsLocalStorage.isProjectExisting()) {
					throw new Error('No existing project found')
				}
				const localStorageProject = projectsLocalStorage.fetchExistingProject()
				return ProjectsActions.initLocalStorageProject({ localStorageProject })
			}),
			catchError((error) => {
				console.error(error)
				return EMPTY
			}) /*tap(({ localStorageProject }) => {
	 const lastModifiedTime = getTimeDifferenceFromNow(
	 localStorageProject.lastModifiedTime,
	 'short',
	 true,
	 )
	 const dynamicNotification = createDynamicNotification({
	 title: 'Loaded Local Save',
	 subtitle: `Last Modified: ${lastModifiedTime}`,
	 photoUrl: undefined,
	 message: undefined,
	 actionButton: undefined,
	 dismissButton: {
	 text: 'Dismiss',
	 onClick: undefined,
	 },
	 })
	 notificationsStore.dispatch.addDynamicNotification(dynamicNotification)
	 }),*/,
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
