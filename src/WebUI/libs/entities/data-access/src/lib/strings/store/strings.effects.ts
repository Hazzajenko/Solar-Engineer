import { Actions, createEffect, ofType } from '@ngrx/effects'
import { inject } from '@angular/core'
import { map, tap } from 'rxjs'
import { StringsActions } from './strings.actions'
import { SelectedActions } from '@canvas/selected/data-access'
import { StringsStatsService } from '../services'
import { ProjectsActions } from '../../projects'

export const stringsStoreInitialized$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(StringsActions.loadStrings),
			map(() => {
				return ProjectsActions.projectEntityStoreInitialized({
					store: 'strings',
				})
			}),
		)
	},
	{ functional: true },
)

export const loadProjectSuccessLoadStrings$ = createEffect(
	(actions$ = inject(Actions)) => {
		return actions$.pipe(
			ofType(ProjectsActions.loadProjectSuccess),
			map(({ projectEntities }) => {
				const strings = projectEntities.strings
				if (!strings) return StringsActions.noop()
				if (!Array.isArray(strings)) return StringsActions.noop()
				return StringsActions.loadStrings({ strings })
			}),
		)
	},
	{ functional: true },
)

/*export const stringsStoreToClear$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(ProjectsActions.selectProject),
 map(() => {
 return StringsActions.clearStringsState()
 }),
 )
 },
 { functional: true },
 )

 export const stringsStoreCleared$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(StringsActions.clearStringsState),
 map(() => {
 return ProjectsActions.projectEntityStoreCleared({
 store: 'strings',
 })
 }),
 )
 },
 { functional: true },
 )*/
/*export const createStringNotification$ = createEffect(
 (actions$ = inject(Actions)) => {
 return actions$.pipe(
 ofType(StringsActions.addString),
 map(({ string }) => {
 const notification: ActionNotificationModel = {
 title: `${string.name} added`,
 message: 'String added',
 duration: 3000,
 type: 'success',
 id: `string-added-${getGuid()}`,
 isOpen: true,
 buttons: [
 {
 text: 'Undo',
 action: () => {
 console.log('undo')
 },
 },
 ],
 }
 return NotificationsActions.addNotification({ notification })
 }),
 )
 },
 { functional: true },
 )*/

export const calculateSelectedStringTotals$ = createEffect(
	(actions$ = inject(Actions), stringStats = inject(StringsStatsService)) => {
		return actions$.pipe(
			ofType(SelectedActions.selectString),
			tap(() => {
				stringStats.calculateStringStatsForSelectedString()
			}),
		)
	},
	{ functional: true, dispatch: false },
)
