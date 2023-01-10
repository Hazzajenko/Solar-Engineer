import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { StringsService } from '@project-id/data-access/api'
import { ProjectsStoreService } from '@projects/data-access/facades'
import { ProjectsActions } from '@projects/data-access/store'
import { EntityModel, EntityType, StringModel } from '@shared/data-access/models'
import { catchError, map, of, switchMap, tap } from 'rxjs'

import { StringsActions, EntitiesActions, PanelsActions } from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class StringsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  private stringsService = inject(StringsService)
  private projectsStore = inject(ProjectsStoreService)
  initStrings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.stringsService.getStringsByProjectId(projectId).pipe(
            map((strings) => StringsActions.loadStringsSuccess({ strings })),
            catchError(error => of(StringsActions.loadStringsFailure({ error: error.message }))),
          ),
        ),
      ),
  )

  /* loadStringsSuccess$ = createEffect(() =>
     this.actions$.pipe(
       ofType(StringsActions.loadStringsSuccess),
       map(({ strings }) => EntitiesActions.addManyEntitiesForGrid({ entities: strings })),
     ),
   )
 */
  initLocalStrings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      map(({ localProject }) =>
        StringsActions.loadStringsSuccess({ strings: localProject.strings }),
      ),
    ),
  )

  addStringHttp$ = createEffect(() =>
      this.actions$.pipe(
        ofType(StringsActions.addString),
        switchMap(({ string }) => this.projectsStore.select.selectIsWebProject$.pipe(
          switchMap(
            isWeb => {
              if (isWeb) {
                return this.stringsService.addString(string)
              }
              // update local state
              return of(undefined)
            },
          ),
        )),
      ),
    { dispatch: false },
  )


  deleteStringHttp$ = createEffect(() =>
      this.actions$.pipe(
        ofType(StringsActions.deleteString),
        switchMap(({ stringId }) => this.projectsStore.select.isWebWithProject$.pipe(
          switchMap(
            ([isWeb, project]) => {
              if (!project) return of(undefined)
              if (isWeb) {
                return this.stringsService.deleteString(stringId, project.id)
              }
              // update local state
              return of(undefined)
            },
          ),
        )),
      ),
    { dispatch: false },
  )
}
