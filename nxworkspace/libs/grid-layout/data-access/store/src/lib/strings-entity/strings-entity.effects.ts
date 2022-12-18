import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '@shared/data-access/store'

import { DataEntities } from '../data-actions'
import { tap } from 'rxjs/operators'
import { EntityOp } from '@ngrx/data'
import { TypeModel } from '@shared/data-access/models'

import { PanelModel } from '@shared/data-access/models'
import { BlockModel } from '@shared/data-access/models'
import { Update } from '@ngrx/entity'
import { BlocksStateActions } from '../blocks'
import { PanelsEntityService } from '../panels-entity'


@Injectable({
  providedIn: 'root',
})
export class StringsEntityEffects {
  updateString$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(`${DataEntities.String} ${EntityOp.SAVE_UPDATE_ONE_SUCCESS}`),
        concatLatestFrom((action) => this.panelsEntity.entities$),
        tap(([action, panels]: [any, any]) => {
          const data = action.payload.data
          console.log(action)
          console.log(panels)

          const stringPanels: PanelModel[] = panels.filter(
            (panel: PanelModel) => panel.stringId === data.id,
          )
          console.log(stringPanels)
          const blocks: Update<BlockModel>[] = stringPanels.map((panel: PanelModel) => {
            const block: BlockModel = {
              id: panel.id,
              location: panel.location,
              type: TypeModel.PANEL,
              projectId: panel.projectId!,
            }
            const update: Update<BlockModel> = {
              id: panel.id,
              changes: block,
            }
            return update
          })
          console.log(blocks)
          this.store.dispatch(
            BlocksStateActions.updateManyBlocksForGrid({
              blocks,
            }),
          )
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private panelsEntity: PanelsEntityService,
    private store: Store<AppState>,
  ) {}
}
