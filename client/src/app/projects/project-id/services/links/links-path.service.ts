import { DisconnectionPointsEntityService } from '../ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { LinksEntityService } from '../ngrx-data/links-entity/links-entity.service'
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

@Injectable({
  providedIn: 'root',
})
export class LinksPathService {
  constructor(
    private store: Store<AppState>,
    private panelsEntity: PanelsEntityService,
    private linksEntity: LinksEntityService,
    private joinsEntity: JoinsEntityService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private cablesEntity: CablesEntityService,
    private logger: LoggerService,
    private itemsService: ItemsService,
    private linksPanelsService: LinksPanelsService,
    private blocksService: BlocksService,
  ) {}

  orderPanelsInLinkOrder(stringId: string) {
    firstValueFrom(
      this.panelsEntity.entities$
        .pipe(map((panels) => panels.filter((p) => p.string_id === stringId)))
        .pipe(
          switchMap((stringPanels) =>
            this.linksEntity.entities$
              .pipe(
                map((links) =>
                  links.filter((l) => stringPanels.map((sps) => sps.id).includes(l.positive_id!)),
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
                disconnectionPoint: dps.find((d) => d.string_id === stringId),
              })),
            ),
          ),
        ),
    ).then((res) => {
      console.log(res)
      const panelIds = res.stringPanels.map((sp) => sp.id)
      console.log(panelIds)
      const firstPanelLink = res.stringLinks.find((sl) => sl.negative_id === res.disconnectionPoint?.id)
      const panelsWithoutNeg = res.stringLinks.filter((sl) => !panelIds.includes(sl.negative_id!))
      console.log(panelsWithoutNeg)
      panelsWithoutNeg.forEach((pwn) => {
        console.log('pwn', pwn)
      })
      // const panelsWithoutNeg = res.stringPanels.filter(sp => !sp.negative_to)
    })
  }
}
