import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { PanelsService } from '../../../services/panels.service'
import { CablesEntityService } from './cables-entity.service'
import { tap } from 'rxjs/operators'
import { BlocksStateActions } from '../../../store/blocks/blocks.actions'
import { UnitModel } from '../../../models/unit.model'
import { DataEntities } from '../data-actions'
import { EntityOp } from '@ngrx/data'
import { BlockModel } from '../../../models/block.model'
import { CableModel } from '../../../models/cable.model'

@Injectable()
export class CablesEntityEffects {
  addCable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Cable} ${EntityOp.SAVE_ADD_ONE_SUCCESS}`),
        tap((action: any) => {
          this.store.dispatch(
            BlocksStateActions.addBlockForGrid({
              block: {
                id: action.payload.data.id,
                location: action.payload.data.location,
                model: UnitModel.CABLE,
                type: 'CABLE',
                project_id: action.payload.data.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  getAllCables$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Cable} ${EntityOp.QUERY_ALL_SUCCESS}`),
        tap((action: any) => {
          const blocks: BlockModel[] = action.payload.data.map(
            (cable: CableModel) => {
              const block: BlockModel = {
                id: cable.id,
                location: cable.location,
                model: UnitModel.CABLE,
                type: 'CABLE',
                project_id: cable.project_id!,
              }
              return block
            },
          )
          this.store.dispatch(
            BlocksStateActions.addManyBlocksForGrid({
              blocks,
            }),
          )
        }),
      ),
    { dispatch: false },
  )
  updateOneCable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.Cable} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        tap((action: any) => {
          console.log(action)
          const data = action.payload.data
          this.store.dispatch(
            BlocksStateActions.updateBlockForGrid({
              block: {
                id: data.id,
                location: data.changes.location,
                model: UnitModel.CABLE,
                type: 'CABLE',
                project_id: data.changes.project_id!,
              },
            }),
          )
        }),
      ),
    { dispatch: false },
  )

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
                      oldLocation: action.request.panel.location,
                      block: {
                        id: res.panel.location,
                        model: UnitModel.PANEL,
                        type: 'PANEL',
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
    )*/

  constructor(
    private actions$: Actions,
    private panelsService: PanelsService,
    private panelsEntity: CablesEntityService,
    private store: Store<AppState>,
  ) {}
}
