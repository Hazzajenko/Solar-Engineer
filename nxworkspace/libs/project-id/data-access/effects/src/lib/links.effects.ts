import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LinksService } from '@project-id/data-access/api'
import { EntitiesActions, LinksActions } from '@project-id/data-access/store'
import { ProjectsActions } from '@projects/data-access/store'
import { catchError, map, of, switchMap } from 'rxjs'

@Injectable()
export class LinksEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  private linksService = inject(LinksService)
  loadLinksSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.loadLinksSuccess),
      map(({ links }) => EntitiesActions.addManyEntitiesForGrid({ entities: links })),
    ),
  )


  initLinks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.linksService.getLinksByProjectId(projectId).pipe(
            map((links) => LinksActions.loadLinksSuccess({ links })),
            catchError((error) => of(LinksActions.loadLinksFailure({ error: error.message }))),
          ),
        ),
      ),
  )
  initLocalLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      map(({ localProject }) => LinksActions.loadLinksSuccess({ links: localProject.links })),
    ),
  )

  addLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.addLink),
      map(({ link }) => EntitiesActions.addEntityForGrid({ entity: link })),
    ),
  )

  deleteLink$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LinksActions.deleteLink),
      map(({ linkId }) =>
        EntitiesActions.deleteEntityForGrid({
          entityId: linkId,
        }),
      ),
    ),
  )
}
