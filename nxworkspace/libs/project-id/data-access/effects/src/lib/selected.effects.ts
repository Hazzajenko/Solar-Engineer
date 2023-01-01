import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { LinksPathService, StatsService } from '@project-id/utils'
import { PanelLinkModel, PanelLinksToModel } from '@shared/data-access/models'
import { tap } from 'rxjs'
import { combineLatestWith, map, switchMap } from 'rxjs/operators'

import {
  LinksFacade,
  SelectedFacade,
  StringsFacade,
  PanelsFacade,
} from '@project-id/data-access/facades'
import { SelectedActions } from '@project-id/data-access/store'

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
  private linksFacade = inject(LinksFacade)
  selectPanel$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedActions.selectPanel),
        switchMap((action) =>
          this.linksFacade.allLinks$.pipe(
            map((links) => getSelectedLinks(links, action.panelId)),
            tap((link) =>
              this.store.dispatch(SelectedActions.setSelectedPanelLinks({ panelLink: link })),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )

  selectPanelWhenStringSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedActions.selectPanelWhenStringSelected),
        switchMap((action) =>
          this.linksFacade.allLinks$.pipe(
            map((links) => getSelectedLinks(links, action.panelId)),
            tap((link) =>
              this.store.dispatch(
                SelectedActions.setSelectedPanelLinksWhenStringSelected({ panelLink: link }),
              ),
            ),
          ),
        ),
      ),
    { dispatch: false },
  )

  private panelsFacade = inject(PanelsFacade)
  private stringsFacade = inject(StringsFacade)
  private linksPathService = inject(LinksPathService)

  selectString$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedActions.selectString),
        switchMap((action) =>
          this.stringsFacade.stringById$(action.stringId).pipe(
            combineLatestWith(this.panelsFacade.panelsByStringId(action.stringId)),
            map(([string, panels]) => {
              if (!string) return
              const panelIds: string[] = panels.map((panel) => panel.id)
              this.store.dispatch(SelectedActions.setSelectedStringPanels({ panelIds }))
              const stringStats = this.statsService.calculateStringTotals(panels)

              const tooltip = `
                  String = ${string.name} \n
                  Color: ${string.color} \n
                  Parallel: ${string.parallel} \n
                  Panels: ${panels.length} \n
                  Voc: ${stringStats.totalVoc}V \n
                  Vmp: ${stringStats.totalVmp}V \n
                  Pmax: ${stringStats.totalPmax}W \n
                  Isc: ${stringStats.totalIsc}A \n
                `
              return { tooltip, panels }
            }),
            tap((res) => {
              if (!res) return
              this.store.dispatch(
                SelectedActions.setSelectedStringTooltip({ tooltip: res.tooltip }),
              )
            }),
            map((res) => {
              if (!res) return
              this.linksPathService
                .orderPanelsInLinkOrder(res.panels)
                .pipe(
                  tap((linkPathMap) =>
                    this.store.dispatch(
                      SelectedActions.setSelectedStringLinkPaths({ pathMap: linkPathMap }),
                    ),
                  ),
                )
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  private selectedFacade = inject(SelectedFacade)

  clearSelectedLinks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedActions.clearSelectedPanelLinks),
        switchMap(() =>
          this.selectedFacade.selectedStringId$.pipe(
            map((selectedStringId) => {
              if (!selectedStringId) return
              return this.panelsFacade
                .panelsByStringId(selectedStringId)
                .pipe(switchMap((panels) => this.linksPathService.orderPanelsInLinkOrder(panels)))
            }),
          ),
        ),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private statsService: StatsService,
    private store: Store,
  ) {}
}
