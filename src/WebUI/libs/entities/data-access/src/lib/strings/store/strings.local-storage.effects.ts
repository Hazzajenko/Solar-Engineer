import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { StringsActions } from './strings.actions'
import { map } from 'rxjs'
import { ProjectsActions } from '../../projects'
import { createProjectLocalStorageEffect$ } from '@entities/utils'

export const initStringsLocalStorage$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ProjectsActions.initLocalStorageProject),
			map(({ localStorageProject }) => {
				return StringsActions.loadLocalStorageStrings({
					strings: localStorageProject.strings,
				})
			}),
		)
	},
	{ functional: true },
)

export const addStringLocalStorage$ = createProjectLocalStorageEffect$(StringsActions.addString)
export const addManyStringsLocalStorage$ = createProjectLocalStorageEffect$(
	StringsActions.addManyStrings,
)
export const updateStringLocalStorage$ = createProjectLocalStorageEffect$(
	StringsActions.updateString,
)
export const updateManyStringsLocalStorage$ = createProjectLocalStorageEffect$(
	StringsActions.updateManyStrings,
)

export const deleteStringLocalStorage$ = createProjectLocalStorageEffect$(
	StringsActions.deleteString,
)

export const deleteManyStringsLocalStorage$ = createProjectLocalStorageEffect$(
	StringsActions.deleteManyStrings,
)

export const addStringWithPanelsLocalStorage$ = createProjectLocalStorageEffect$(
	StringsActions.addStringWithPanels,
)
