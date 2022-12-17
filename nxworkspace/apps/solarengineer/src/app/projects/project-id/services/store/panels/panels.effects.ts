import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsService } from '../../../../services/panels.service'
import { firstValueFrom, lastValueFrom, tap } from 'rxjs'
import { BlocksStateActions } from '../blocks/blocks.actions'
import { TypeModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/type.model'
import { PanelStateActions } from './panels.actions'
import { PanelsHelperService } from '../../ngrx-data/panels-entity/panels.service'
import { selectCurrentProjectId } from '../projects/projects.selectors'
import { HttpClient } from '@angular/common/http'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'

@Injectable()
export class PanelsEffects {
  addPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelStateActions.addPanel),
        tap((action: any) => {
          firstValueFrom(this.store.select(selectCurrentProjectId)).then(
            (projectId) => {
              const panel: PanelModel = action.panel
              this.store.dispatch(
                BlocksStateActions.addBlockForGrid({
                  block: {
                    id: action.panel.id,
                    location: action.panel.location,
                    type: TypeModel.PANEL,
                    projectId,
                  },
                }),
              )
              lastValueFrom(
                this.http.post(`/api/projects/${projectId}/panel`, {
                  ...action.panel,
                }),
              ).then((res) => console.log(res))
            },
            // catchError(async (err) => console.log(err)),
          )
        }),
      ),
    { dispatch: false },
  )
  /*  lastValueFrom(
      this.http.post(`/api/projects/${projectId}/panel`, {
  ...action.panel,
  }),
  ).then((res) => console.log(res))*/

  /*  updatePanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(PanelStateActions.updatePanelHttp),
          exhaustMap((action) =>
            this.panelsService.updatePanel(action.request).pipe(
              map(
                (res) => {
                  console.log(res)
                  this.store.dispatch(
                    PanelStateActions.updatePanelToState({
                      panel: res.panel,
                    }),
                  )
                  this.store.dispatch(
                    BlocksStateActions.updateBlockForGrid({
                      // oldLocation: action.request.panel.location,
                      block: {
                        id: res.panel.id,
                        location: res.panel.location,
                        model: UnitModel.PANEL,
                        projectId: res.panel.projectId!,
                      },
                    }),
                  )
                  console.log(res)
                },
                // catchError(async (err) => console.log(err)),
              ),
              catchError(async (error) => console.log(error)),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsHelpers: PanelsHelperService,
    private store: Store<AppState>,
    private http: HttpClient,
  ) {}
}
