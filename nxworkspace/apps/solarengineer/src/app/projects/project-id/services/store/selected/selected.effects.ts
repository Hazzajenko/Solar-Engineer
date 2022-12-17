import { PanelLinksEntityService } from '../../ngrx-data/panel-links-entity/panel-links-entity.service'
import { Injectable } from '@angular/core'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../../store/app.state'
import { async, combineLatestWith, firstValueFrom, switchMap, tap } from 'rxjs'
import { map } from 'rxjs/operators'
import { SelectedStateActions } from './selected.actions'
import { PanelLinksToModel } from '../../../../models/deprecated-for-now/panel-links-to.model'
import { PanelsEntityService } from '../../ngrx-data/panels-entity/panels-entity.service'
import { StringsEntityService } from '../../ngrx-data/strings-entity/strings-entity.service'
import { StatsService } from '../../stats.service'
import { PanelModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel.model'
import { PanelLinkModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/panel-link.model'
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
        tap(async (action) => {
          const panelLinks = await firstValueFrom(this.panelLinksEntity.entities$)
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
          const panelLinks = await firstValueFrom(this.panelLinksEntity.entities$)
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
          this.panelLinksEntity.entities$.pipe(
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
        tap(async (action) => {
          /*          this.stringsEntity.entities$.pipe(
/!*            combineLatestWith(this.panelsEntity.entities$.pipe(
              map(panels => panels.filter(panel => panel.stringId === action.stringId))
            )),*!/
            map((strings) => {*/
          // map(([strings, panels]) => {
          const stringPanels = await firstValueFrom(
            this.panelsEntity.entities$.pipe(
              map((panels) => panels.filter((panel) => panel.stringId === action.stringId)),
            ),
          )

          // const selectedString = strings.find((s) => s.id === action.stringId)
          const selectedString = await firstValueFrom(
            this.stringsEntity.entities$.pipe(
              map((strings) => strings.find((string) => string.id === action.stringId)),
            ),
          )
          /*    const stringPanels: PanelModel[] = panels.filter(
                (panel) => panel.stringId === action.stringId,
              )*/
          const panelIds: string[] = stringPanels.map((p) => p.id)
          this.store.dispatch(SelectedStateActions.setSelectedStringPanels({ panelIds }))

          const stringStats = this.statsService.calculateStringTotals(selectedString!, stringPanels)

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
          /*firstValueFrom(this.panelsEntity.entities$.pipe(
                map(panels => panels.filter(
                  (panel) => panel.stringId === action.stringId,
                ))
              )).then(stringPanels => {
                const selectedString = strings.find((s) => s.id === action.stringId)
            /!*    const stringPanels: PanelModel[] = panels.filter(
                  (panel) => panel.stringId === action.stringId,
                )*!/
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
              })*/
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
