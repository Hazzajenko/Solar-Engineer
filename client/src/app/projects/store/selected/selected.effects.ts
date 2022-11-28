import { PanelJoinsEntityService } from './../../project-id/services/panel-joins-entity/panel-joins-entity.service'
import { PanelJoinModel } from './../../models/panel-join.model'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { PanelsService } from '../../services/panels.service'
import { exhaustMap, switchMap } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { BlocksStateActions } from '../blocks/blocks.actions'
import { UnitModel } from '../../models/unit.model'
import { SelectedStateActions } from './selected.actions'
import { PanelLinkModel } from '../../models/panel-link.model'

function getSelectedLinks(
  panelJoins?: PanelJoinModel[],
  selectedPanelId?: string,
): PanelLinkModel {
  if (!panelJoins || !selectedPanelId) {
    return {
      selectedPositiveLinkTo: undefined,
      selectedNegativeLinkTo: undefined,
    } as PanelLinkModel
  }
  const positive = panelJoins.find(
    (pJoin) => pJoin.negative_id === selectedPanelId,
  )?.positive_id
  const negative = panelJoins.find(
    (pJoin) => pJoin.positive_id === selectedPanelId,
  )?.negative_id
  return {
    selectedPositiveLinkTo: positive,
    selectedNegativeLinkTo: negative,
  } as PanelLinkModel
}

@Injectable()
export class SelectedEffects {
  selectPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectPanel),
        switchMap(
          (action) =>
            this.panelJoinsEntity.entities$.pipe(
              map((res) => {
                const panelLink: PanelLinkModel = getSelectedLinks(
                  res,
                  action.panelId,
                )
                this.store.dispatch(
                  SelectedStateActions.setSelectedPanelLinks({ panelLink }),
                )
              }),
            ),
          // this.panelsService.addPanel(action.).pipe(
          //   map(
          //     (res) => {
          //       this.store.dispatch(
          //         PanelStateActions.addPanelToState({
          //           panel: res.panel,
          //         }),
          //       )
          //       this.store.dispatch(
          //         BlocksStateActions.addBlockForGrid({
          //           block: {
          //             id: res.panel.id,
          //             location: res.panel.location,
          //             model: UnitModel.PANEL,
          //             type: 'PANEL',
          //             project_id: res.panel.project_id!,
          //           },
          //         }),
          //       )
          //     },
          //     // catchError(async (err) => console.log(err)),
          //   ),
          // ),
        ),
      ),
    { dispatch: false },
  )


  constructor(
    private actions$: Actions,
    private panelJoinsEntity: PanelJoinsEntityService,
    private store: Store<AppState>,
  ) {}
}
