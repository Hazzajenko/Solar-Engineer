import { Injectable } from '@angular/core'
import { LinksPathService, StatsService } from '@grid-layout/data-access/api'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import {
  PanelLinkModel,
  PanelLinksToModel,
  PanelModel,
  StringModel,
} from '@shared/data-access/models'
import { AppState } from '@shared/data-access/store'
import { firstValueFrom, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { PanelLinksEntityService } from '../panel-links-entity'
import { PanelsEntityService } from '../panels-entity'
import { StringsEntityService } from '../strings-entity'
import { SelectedStateActions } from './selected.actions'
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
        tap(async (action) => {
          const panelLinks: PanelLinkModel[] = await firstValueFrom(this.panelLinksEntity.entities$)
          const panelLink: PanelLinksToModel = getSelectedLinks(panelLinks, action.panelId)
          this.store.dispatch(SelectedStateActions.setSelectedPanelLinks({ panelLink }))
        }),
      ),
    { dispatch: false },
  )

  selectPanelWhenStringSelected$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectPanelWhenStringSelected),
        tap(async (action) => {
          const panelLinks: PanelLinkModel[] = await firstValueFrom(this.panelLinksEntity.entities$)
          const panelLink: PanelLinksToModel = getSelectedLinks(panelLinks, action.panelId)
          this.store.dispatch(
            SelectedStateActions.setSelectedPanelLinksWhenStringSelected({ panelLink }),
          )
        }),
      ),
    { dispatch: false },
  )

  selectDp$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.selectDp),
        switchMap((action) =>
          this.panelLinksEntity.entities$.pipe(
            map((res: PanelLinkModel[]) => {
              const panelLink: PanelLinksToModel = getSelectedLinks(res, action.dpId)
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
        tap(async (action) => {
          /*          this.stringsEntity.entities$.pipe(
/!*            combineLatestWith(this.panelsEntity.entities$.pipe(
              map(panels => panels.filter(panel => panel.stringId === action.stringId))
            )),*!/
            map((strings) => {*/
          // map(([strings, panels]) => {
          const stringPanels: PanelModel[] = await firstValueFrom(
            this.panelsEntity.entities$.pipe(
              map((panels: PanelModel[]) =>
                panels.filter((panel) => panel.stringId === action.stringId),
              ),
            ),
          )

          // const selectedString = strings.find((s) => s.id === action.stringId)
          const selectedString: StringModel | undefined = await firstValueFrom(
            this.stringsEntity.entities$.pipe(
              map((strings: StringModel[]) =>
                strings.find((string) => string.id === action.stringId),
              ),
            ),
          )
          /*    const stringPanels: PanelModel[] = panels.filter(
                (panel) => panel.stringId === action.stringId,
              )*/
          const panelIds: string[] = stringPanels.map((p) => p.id)
          this.store.dispatch(SelectedStateActions.setSelectedStringPanels({ panelIds }))

          const stringStats = this.statsService.calculateStringTotals(selectedString!, stringPanels)

          const tooltip = `
                String = ${selectedString?.name} \n
                Color: ${selectedString?.color} \n
                Parallel: ${selectedString?.parallel} \n
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
    { dispatch: false },
  )

  clearSelectedLinks$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SelectedStateActions.clearSelectedPanelLinks),
        tap(async (action) => {
          const selectedStringId = await firstValueFrom(this.store.select(selectSelectedStringId))
          if (selectedStringId) {
            await this.linksPathService.orderPanelsInLinkOrder(selectedStringId)
          }
          /*this.store.select(selectSelectedStringId).pipe(
              map((selectedStringId) => {
                if (selectedStringId) {
                  this.linksPathService.orderPanelsInLinkOrder(selectedStringId)
                }
              }),
            ),*/
        }),
      ),
    { dispatch: false },
  )

  constructor(
    private actions$: Actions,
    private panelLinksEntity: PanelLinksEntityService,
    private panelsEntity: PanelsEntityService,
    private stringsEntity: StringsEntityService,
    private statsService: StatsService,
    private store: Store<AppState>,
    private linksPathService: LinksPathService,
  ) {}
}
