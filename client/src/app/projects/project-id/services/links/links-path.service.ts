import { DisconnectionPointsEntityService } from '../ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { PanelLinksEntityService } from '../ngrx-data/panel-links-entity/panel-links-entity.service'
import { PanelsEntityService } from '../ngrx-data/panels-entity/panels-entity.service'
import { Injectable } from '@angular/core'
import { Store } from '@ngrx/store'
import { AppState } from '../../../../store/app.state'
import { JoinsEntityService } from '../ngrx-data/joins-entity/joins-entity.service'
import { firstValueFrom, switchMap } from 'rxjs'
import { LoggerService } from '../../../../services/logger.service'
import { CablesEntityService } from '../ngrx-data/cables-entity/cables-entity.service'
import { ItemsService } from '../items.service'
import { LinksPanelsService } from './links-panels.service'
import { BlocksService } from '../store/blocks/blocks.service'
import { map } from 'rxjs/operators'
import { SelectedStateActions } from '../store/selected/selected.actions'

@Injectable({
  providedIn: 'root',
})
export class LinksPathService {
  constructor(
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private linksEntity: PanelLinksEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private cablesEntity: CablesEntityService,
    private logger: LoggerService,
    private itemsService: ItemsService,
    private linksPanelsService: LinksPanelsService,
    private blocksService: BlocksService,
  ) {}

  orderPanelsInLinkOrder(stringId: string) {
    return firstValueFrom(
      this.panelsEntity.entities$
        .pipe(map((panels) => panels.filter((p) => p.stringId === stringId)))
        .pipe(
          switchMap((stringPanels) =>
            this.linksEntity.entities$
              .pipe(
                map((links) =>
                  links.filter((l) => stringPanels.map((sps) => sps.id).includes(l.positiveToId!)),
                ),
              )
              .pipe(map((stringLinks) => ({ stringPanels, stringLinks }))),
          ),
        )
        .pipe(
          switchMap((res) =>
            this.disconnectionPointsEntity.entities$.pipe(
              map((dps) => ({
                stringPanels: res.stringPanels,
                stringLinks: res.stringLinks,
                disconnectionPoint: dps.find((d) => d.stringId === stringId),
              })),
            ),
          ),
        ),
    ).then((res) => {
      /*      console.log(res)
            const panelIds = res.stringPanels.map((sp) => sp.id)
            console.log(panelIds)
            const firstPanelLink = res.stringLinks.find(
              (sl) => sl.negativeToId === res.disconnectionPoint?.id,
            )
            const panelsWithoutNeg = res.stringLinks.filter((sl) => !panelIds.includes(sl.negativeToId!))
            console.log(panelsWithoutNeg)
            panelsWithoutNeg.forEach((pwn) => {
              console.log('pwn', pwn)
            })*/
      let myMap = new Map<string, number>()
      const firstPanelLink = res.stringLinks[0]
      const firstPanel = res.stringPanels.find((x) => x.id === firstPanelLink.negativeToId)
      if (!firstPanel) {
        return console.error('!firstPanel')
      }
      myMap.set(firstPanel.id, 1)
      const secondPanel = res.stringPanels.find((x) => x.id === firstPanelLink.positiveToId)
      if (!secondPanel) {
        return console.error('!secondPanel')
      }
      myMap.set(secondPanel.id, 2)
      const secondPanelLink = res.stringLinks.find((x) => x.negativeToId === secondPanel.id)
      if (!secondPanelLink) {
        return console.error('!secondPanelLink')
      }
      const thirdPanel = res.stringPanels.find((x) => x.id === secondPanelLink.positiveToId)
      if (!thirdPanel) {
        return console.error('!thirdPanel')
      }
      myMap.set(thirdPanel.id, 3)
      this.store.dispatch(SelectedStateActions.setSelectedStringLinkPaths({ pathMap: myMap }))
      console.log(myMap)
      // const panelsWithoutNeg = res.stringPanels.filter(sp => !sp.negative_to)
    })
  }
}
