import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { PanelsService } from '../../services/panels.service'
import { exhaustMap, switchMap } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BlocksStateActions } from '../../project-id/services/store/blocks/blocks.actions'
import { UnitModel } from '../../models/unit.model'
import { PanelStateActions } from './panels.actions'

@Injectable()
export class PanelsEffects {
  addPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PanelStateActions.addPanelHttp),
        switchMap((action) =>
          this.panelsService.addPanel(action.request).pipe(
            map(
              (res) => {
                this.store.dispatch(
                  PanelStateActions.addPanelToState({
                    panel: res.panel,
                  }),
                )
                this.store.dispatch(
                  BlocksStateActions.addBlockForGrid({
                    block: {
                      id: res.panel.id,
                      location: res.panel.location,
                      model: UnitModel.PANEL,
                      project_id: res.panel.project_id!,
                    },
                  }),
                )
              },
              // catchError(async (err) => console.log(err)),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )
  updatePanel$ = createEffect(
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
                      project_id: res.panel.project_id!,
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
  )

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private store: Store<AppState>,
  ) {}
}
