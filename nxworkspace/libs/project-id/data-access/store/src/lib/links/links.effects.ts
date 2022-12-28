import { ProjectsActions } from '@projects/data-access/store'
import { inject, Injectable } from '@angular/core'
import { tapResponse } from '@ngrx/component-store'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LinksService } from '@project-id/data-access/api'
import { EntityModel, EntityType, PanelLinkModel } from '@shared/data-access/models'
import { of, switchMap, tap } from 'rxjs'
import { EntitiesActions } from '../entities/entities.actions'
import { LinksActions } from './links.actions'

@Injectable()
export class LinksEffects {
  private actions$ = inject(Actions)
  private store = inject(Store)
  loadLinksSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LinksActions.loadLinksSuccess),
        tap(({ links }) => {
          if (!links) return
          const entities = links.map((link) => {
            return new EntityModel({
              id: link.id,
              projectId: link.projectId,
              type: EntityType.LINK,
            })
          })
          this.store.dispatch(EntitiesActions.addManyEntitiesForGrid({ entities }))
        }),
      ),
    { dispatch: false },
  )
  private linksService = inject(LinksService)
  initLinks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProjectsActions.initSelectProject),
        switchMap(({ projectId }) =>
          this.linksService.getLinksByProjectId(projectId).pipe(
            tapResponse(
              (links: PanelLinkModel[]) =>
                this.store.dispatch(LinksActions.loadLinksSuccess({ links })),
              (error: Error) =>
                this.store.dispatch(LinksActions.loadLinksFailure({ error: error.message })),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )
  initLocalLinks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProjectsActions.initLocalProject),
      switchMap(({ localProject }) =>
        of(LinksActions.loadLinksSuccess({ links: localProject.links })),
      ),
    ),
  )
}
