import { PanelLinksEntityService } from '../../ngrx-data/panel-links-entity/panel-links-entity.service'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { combineLatestWith, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { SelectedStateActions } from './selected.actions'
import { PanelLinksToModel } from '../../../../models/deprecated-for-now/panel-links-to.model'
import { PanelsEntityService } from '../../ngrx-data/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../stats.service'
import { PanelModel } from '../../../../models/panel.model'
import { PanelLinkModel } from '../../../../models/panel-link.model'
import { LinksPathService } from '../../links/links-path.service'
import { selectSelectedStringId } from './selected.selectors'

function getSelectedLinks(
  panelJoins?: PanelLinkModel[],
  selectedPanelId?: string,
): PanelLinksToModel {
  if (!panelJoins || !selectedPanelId) {
    return {
      selectedPositiveLinkTo: undefined,
      selectedNegativeLinkTo: undefined,
    } as PanelLinksToModel
  }
  const positive = panelJoins.find((pJoin) => pJoin.negativeToId === selectedPanelId)?.positiveToId
  const negative = panelJoins.find((pJoin) => pJoin.positiveToId === selectedPanelId)?.negativeToId
  return {
    selectedPositiveLinkTo: positive,
    selectedNegativeLinkTo: negative,
  } as PanelLinksToModel
}

@Injectable()
export class SelectedEffects {
  selectPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectPanel),
        switchMap((action) =>
          /*            this.panelsEntity.entities$.pipe(
                        map((panels) => {
                          const panel = panels.find(p => p.id === action.panelId)
                          if (panel) {
                            const panelLink: PanelLinksToModel = {
                              selectedPositiveLinkTo: panel.positive_to_id,
                              selectedNegativeLinkTo: panel.negative_to_id,
                            }
                            this.store.dispatch(
                              SelectedStateActions.setSelectedPanelLinks({ panelLink }),
                            )
                          }

                        }),
                      ),*/
          this.panelJoinsEntity.entities$.pipe(
            map((res) => {
              const panelLink: PanelLinksToModel = getSelectedLinks(res, action.panelId)
              this.store.dispatch(SelectedStateActions.setSelectedPanelLinks({ panelLink }))
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  selectDp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectDp),
        switchMap((action) =>
          this.panelJoinsEntity.entities$.pipe(
            map((res) => {
              const panelLink: PanelLinksToModel = getSelectedLinks(res, action.dpId)
              this.store.dispatch(SelectedStateActions.setSelectedPanelLinks({ panelLink }))
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  selectCable$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectCable),
        switchMap((action) =>
          this.panelJoinsEntity.entities$.pipe(
            map((res) => {
              const panelLink: PanelLinksToModel = getSelectedLinks(res, action.cableId)
              this.store.dispatch(SelectedStateActions.setSelectedPanelLinks({ panelLink }))
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
              const selectedString = strings.find((s) => s.id === action.stringId)
              const stringPanels: PanelModel[] = panels.filter(
                (panel) => panel.stringId === action.stringId,
              )
              const panelIds: string[] = stringPanels.map((p) => p.id)
              this.store.dispatch(SelectedStateActions.setSelectedStringPanels({ panelIds }))

              const stringStats = this.statsService.calculateStringTotals(
                selectedString!,
                stringPanels,
              )

              const tooltip: string = `
                String = ${selectedString?.name} \n
                Color: ${selectedString?.color} \n
                Parallel: ${selectedString?.isInParallel} \n
                Panels: ${stringPanels.length} \n
                Voc: ${stringStats.totalVoc}V \n
                Vmp: ${stringStats.totalVmp}V \n
                Pmax: ${stringStats.totalPmax}W \n
                Isc: ${stringStats.totalIsc}A \n

              `
              this.store.dispatch(SelectedStateActions.setSelectedStringTooltip({ tooltip }))

              this.linksPathService.orderPanelsInLinkOrder(action.stringId).then((res) => {
                console.log(res)
              })
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  clearSelectedLinks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.clearSelectedPanelLinks),
        map(async (action) =>
          this.store.select(selectSelectedStringId).pipe(
            map((selectedStringId) => {
              if (selectedStringId) {
                this.linksPathService.orderPanelsInLinkOrder(selectedStringId)
              }
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private panelJoinsEntity: PanelLinksEntityService,
    private panelsEntity: PanelsEntityService,
    private stringsEntity: StringsEntityService,
    private statsService: StatsService,
    private store: Store<AppState>,
    private linksPathService: LinksPathService,
  ) {}
}
