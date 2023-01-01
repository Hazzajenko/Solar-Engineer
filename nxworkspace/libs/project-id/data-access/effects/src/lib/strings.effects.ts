import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { StringsService } from '@project-id/data-access/api'
import { ProjectsActions } from '@projects/data-access/store'
import { EntityModel, EntityType, StringModel } from '@shared/data-access/models'
import { catchError, map, of, switchMap, tap } from 'rxjs'

import { StringsActions, EntitiesActions } from '@project-id/data-access/store'

@Injectable({
  providedIn: 'root',
})
export class StringsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  private stringsService = inject(StringsService)
  initStrings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.stringsService.getStringsByProjectId(projectId).pipe(
            map((strings) => StringsActions.loadStringsSuccess({ strings })),
            catchError(error => of(StringsActions.loadStringsFailure({ error: error.message })))
          ),
        ),
      ),
  )

  loadStringsSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StringsActions.loadStringsSuccess),
      map(({ strings }) => EntitiesActions.addManyEntitiesForGrid({ entities: strings })),
    ),
  )

  initLocalStrings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      map(({ localProject }) =>
        StringsActions.loadStringsSuccess({ strings: localProject.strings }),
      ),
    ),
  )

  addString$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StringsActions.addString),
      map(({ string }) => EntitiesActions.addEntityForGrid({ entity: string })),
    ),
  )

  updateOneString$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StringsActions.updateString),
      map(({ update }) =>
        EntitiesActions.updateEntityForGrid({
          update,
        }),
      ),
    ),
  )

  deleteString$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StringsActions.deleteString),
      map(({ stringId }) =>
        EntitiesActions.deleteEntityForGrid({
          entityId: stringId,
        }),
      ),
    ),
  )
}
