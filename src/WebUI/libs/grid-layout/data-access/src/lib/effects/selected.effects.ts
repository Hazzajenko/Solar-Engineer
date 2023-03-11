import { inject, Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'

import {
  LinksFacade,
  LinksPathService,
  PanelsFacade,
  SelectedActions,
  SelectedFacade,
  StatsService,
  StringsActions,
  StringsFacade,
} from '../'
import { map } from 'rxjs/operators'

@Injectable()
export class SelectedEffects {
  private linksFacade = inject(LinksFacade)
  /*
    selectPanel$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SelectedActions.selectPanel),
          switchMap((action) =>
            this.linksFacade.allLinks$.pipe(
              map((links) =>
                SelectedActions.setSelectedPanelLinks({ panelLink: getSelectedLinks(links, action.panelId) })),
              /!*            map((links) => getSelectedLinks(links, action.panelId)),
                          tap((link) =>
                            this.store.dispatch(SelectedActions.setSelectedPanelLinks({ panelLink: link })),
                          ),*!/
            ),
          ),
        ),
      // { dispatch: false },
    )

    selectPanelWhenStringSelected$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SelectedActions.selectPanelWhenStringSelected),
          map(async (action) => {
            const links = await this.linksFacade.allLinks
          }),
          switchMap((action) =>
            this.linksFacade.allLinks$.pipe(
              map((links) =>
                SelectedActions.setSelectedPanelLinks({ panelLink: getSelectedLinks(links, action.panelId) })),
              /!*            map((links) => getSelectedLinks(links, action.panelId)),
                          tap((link) =>
                            this.store.dispatch(
                              SelectedActions.setSelectedPanelLinksWhenStringSelected({ panelLink: link }),
                            ),
                          ),*!/
            ),
          ),
        ),
      // { dispatch: false },
    )
  */

  private panelsFacade = inject(PanelsFacade)
  private stringsFacade = inject(StringsFacade)
  private linksPathService = inject(LinksPathService)

  selectString$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedActions.selectString),
        map(({ string, panels }) => {
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
          return SelectedActions.setSelectedStringTooltip({ tooltip })
        }),
      ),
    // { dispatch: false },
  )

  clearSelectedString$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(StringsActions.deleteString),
        map(() => {
          return SelectedActions.clearSelectedState()
        }),
      ),
    // { dispatch: false },
  )

  /*  stringLinkPath$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SelectedActions.selectString),
          switchMap(({ panels }) => this.linksPathService
            .orderPanelsInLinkOrder(panels)
            .pipe(
              map(linkPathMap => SelectedActions.setSelectedStringLinkPaths({ pathMap: linkPathMap })),
            ),
          ),
        ),
    )*/

  private selectedFacade = inject(SelectedFacade)

  /*  clearSelectedLinks$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(SelectedActions.clearSelectedPanelLinks),
          switchMap(() =>
            this.selectedFacade.selectedStringId$.pipe(
              map((selectedStringId) => {
                if (!selectedStringId) return
                return this.panelsFacade
                  .panelsByStringId$(selectedStringId)
                  .pipe(switchMap((panels) => this.linksPathService.orderPanelsInLinkOrder(panels)))
              }),
            ),
          ),
        ),
      { dispatch: false },
    )*/

  constructor(
    private actions$: Actions,
    private statsService: StatsService,
    private store: Store,
  ) {}
}
