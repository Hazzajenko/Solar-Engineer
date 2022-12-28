import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { StringsService } from '@project-id/data-access/api'
import { ProjectsActions } from '@projects/data-access/store'
import { EntityModel, EntityType, StringModel } from '@shared/data-access/models'
import { of, switchMap, tap } from 'rxjs'
import { EntitiesActions } from '../entities/entities.actions'
import { StringsActions } from './strings.actions'

@Injectable({
  providedIn: 'root',
})
export class StringsEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)

  loadStringsSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StringsActions.loadStringsSuccess),
        tap(({ strings }) => {
          const entities = strings.map((string) => {
            return new EntityModel({
              id: string.id,
              projectId: string.projectId,
              type: EntityType.STRING,
            })
          })
          this.store.dispatch(EntitiesActions.addManyEntitiesForGrid({ entities }))
        }),
      ),
    { dispatch: false },
  )
  private stringsService = inject(StringsService)
  initStrings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.stringsService.getStringsByProjectId(projectId).pipe(
            tapResponse(
              (strings: StringModel[]) =>
                this.store.dispatch(StringsActions.loadStringsSuccess({ strings })),
              (error: Error) =>
                this.store.dispatch(StringsActions.loadStringsFailure({ error: error.message })),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )

  initLocalStrings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      switchMap(({ localProject }) =>
        of(StringsActions.loadStringsSuccess({ strings: localProject.strings })),
      ),
    ),
  )
}
