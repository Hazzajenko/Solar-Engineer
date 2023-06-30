import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, switchMap } from 'rxjs'
import { ProjectsActions, ProjectsLocalStorageService } from '@entities/data-access'
import { AuthActions } from '@auth/data-access'
import { fetchProjectTemplateData } from '@entities/shared'

export const initLocalStorageProject$ = createEffect(
	(actions$ = inject(Actions), projectsLocalStorage = inject(ProjectsLocalStorageService)) => {
		return actions$.pipe(
			ofType(AuthActions.signInAsGuest),
			map(() => {
				let localStorageProject = projectsLocalStorage.fetchExistingProject()
				if (!localStorageProject) {
					localStorageProject = projectsLocalStorage.initNewProject()
				}
				return ProjectsActions.initLocalStorageProject({ localStorageProject })
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
