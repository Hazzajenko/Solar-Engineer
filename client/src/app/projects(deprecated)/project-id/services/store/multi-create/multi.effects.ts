import { PanelLinksEntityService } from '../../ngrx-data/panel-links-entity/panel-links-entity.service'
import { Injectable } from '@angular/core'
import { Actions } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { PanelsEntityService } from '../../ngrx-data/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../stats.service'

@Injectable()
export class MultiEffects {
  /*  finishMultiCreateRail$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(MultiActions.finishMultiCreateRail),
          switchMap((action) =>
            this.panelJoinsEntity.entities$.pipe(
              map((res) => {
                const panelLink: PanelLinksToModel = getSelectedLinks(res, action.panelId)
                this.store(deprecated).dispatch(SelectedStateActions.setSelectedPanelLinks({ panelLink }))
              }),
            ),
          ),
        ),
      { dispatch: false },
  )*/

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
                this.store(deprecated).dispatch(
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
    private panelJoinsEntity: PanelLinksEntityService,
    private panelsEntity: PanelsEntityService,
    private stringsEntity: StringsEntityService,
    private statsService: StatsService,
    private store: Store<AppState>,
  ) {}
}
