import { PanelJoinsEntityService } from './../../project-id/services/panel-joins-entity/panel-joins-entity.service'
import { PanelJoinModel } from './../../models/panel-join.model'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../store/app.state'
import { combineLatestWith, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { SelectedStateActions } from './selected.actions'
import { PanelLinkModel } from '../../models/panel-link.model'
import { PanelsEntityService } from '../../project-id/services/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../project-id/services/strings-entity/strings-entity.service'
import { StatsService } from '../../services/stats.service'
import { PanelModel } from '../../models/panel.model'

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
        switchMap((action) =>
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
        ),
      ),
    { dispatch: false },
  )

  selectString$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectString),
        switchMap((action) =>
          this.stringsEntity.entities$.pipe(
            combineLatestWith(this.panelsEntity.entities$),
            map(([strings, panels]) => {
              const selectedString = strings.find(
                (s) => s.id === action.stringId,
              )
              const stringPanels: PanelModel[] = panels.filter(
                (panel) => panel.string_id === action.stringId,
              )
              const panelIds: string[] = stringPanels.map((p) => p.id)
              this.store.dispatch(
                SelectedStateActions.setSelectedStringPanels({ panelIds }),
              )

              const stringStats = this.statsService.calculateStringTotals(
                selectedString!,
                stringPanels,
              )

              const tooltip: string = `
                String = ${selectedString?.name} \r\n
                Color: ${selectedString?.color} \r\n
                Parallel: ${selectedString?.is_in_parallel} \r\n
                Panels: ${stringPanels.length} \r\n
                TotalVoc: ${stringStats.totalVoc}V \r\n
                TotalVmp: ${stringStats.totalVmp}V \r\n
                TotalPmax: ${stringStats.totalPmax}W \r\n
                TotalIsc: ${stringStats.totalIsc}A \r\n
              `
              this.store.dispatch(
                SelectedStateActions.setSelectedStringTooltip({ tooltip }),
              )
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private panelJoinsEntity: PanelJoinsEntityService,
    private panelsEntity: PanelsEntityService,
    private stringsEntity: StringsEntityService,
    private statsService: StatsService,
    private store: Store<AppState>,
  ) {}
}
