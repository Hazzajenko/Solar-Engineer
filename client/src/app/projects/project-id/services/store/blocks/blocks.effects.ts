import { LinksEntityService } from '../../ngrx-data/links-entity/links-entity.service'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsEntityService } from '../../ngrx-data/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../stats.service'
import { switchMap } from 'rxjs'
import { BlocksStateActions } from './blocks.actions'

@Injectable()
export class BlocksEffects {
  deleteManyBlocks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BlocksStateActions.deleteManyBlocksForGrid),
        switchMap((action) => {
          const panels = action.blocks.map(blocks)
        }),
      ),
    { dispatch: false },
  )

  /*  finishMultiCreatePanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(MultiActions.finishMultiCreatePanel),
          switchMap((action) =>
            this.panelJoinsEntity.entities$.pipe(
              map((res) => {
                const panelLink: PanelLinksToModel = getSelectedLinks(
                  res,
                  action.panelId,
                )
                this.store.dispatch(
                  SelectedStateActions.setSelectedPanelLinks({ panelLink }),
                )
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private panelJoinsEntity: LinksEntityService,
    private panelsEntity: PanelsEntityService,
    private stringsEntity: StringsEntityService,
    private statsService: StatsService,
    private store: Store<AppState>,
  ) {}
}
