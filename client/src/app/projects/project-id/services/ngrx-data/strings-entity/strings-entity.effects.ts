import { Injectable } from '@angular/core'
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsService } from '../../../../services/panels.service'
import { DataEntities } from '../data-actions'
import { tap } from 'rxjs/operators'
import { EntityOp } from '@ngrx/data'
import { UnitModel } from '../../../../models/unit.model'
import { BlocksStateActions } from '../../store/blocks/blocks.actions'
import { PanelModel } from '../../../../models/panel.model'
import { BlockModel } from '../../../../models/block.model'
import { Update } from '@ngrx/entity'
import { PanelsEntityService } from '../panels-entity/panels-entity.service'

@Injectable()
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
              model: UnitModel.PANEL,
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
    private panelsService: PanelsService,
    private panelsEntity: PanelsEntityService,
    private store: Store<AppState>,
  ) {}
}
