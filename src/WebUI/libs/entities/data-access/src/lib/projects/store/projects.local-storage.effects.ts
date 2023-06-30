import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, switchMap, tap } from 'rxjs'
import { ProjectsActions, ProjectsLocalStorageService } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { fetchProjectTemplateData } from '@entities/shared'
import { DIALOG_COMPONENT, injectUiStore } from '@overlays/ui-store/data-access'

export const initLocalStorageProject$ = createEffect(
	(
		actions$ = inject(Actions),
		projectsLocalStorage = inject(ProjectsLocalStorageService),
		uiStore = injectUiStore(),
	) => {
		return actions$.pipe(
			ofType(AuthActions.signInAsGuest),
			map(() => {
				if (!projectsLocalStorage.isProjectExisting()) {
					/*			return UiActions.openDialog({
			 dialog: {
			 component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
			 },
			 })*/
					return ProjectsActions.noop()
				}
				const localStorageProject = projectsLocalStorage.fetchExistingProject()

				/*				if (!localStorageProject) {
		 return UiActions.openDialog({
		 dialog: {
		 component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
		 },
		 })
		 // localStorageProject = projectsLocalStorage.initNewProject()
		 }*/
				return ProjectsActions.initLocalStorageProject({ localStorageProject })
			}),
			tap((action) => {
				if (action.type === '[Projects Store] Init Local Storage Project') return
				projectsLocalStorage.initNewProject()
				setTimeout(() => {
					uiStore.dispatch.openDialog({
						component: DIALOG_COMPONENT.VIEW_PROJECT_TEMPLATES,
					})
				}, 1000)
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
		)
	},
	{ functional: true },
)
