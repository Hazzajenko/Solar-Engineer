import { Pipe, PipeTransform } from '@angular/core'
import { Observable, of, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'
import { StringModel } from '../../../../../../../../../libs/shared/data-access/models/src/lib/string.model'
import { StatsService, TotalModel } from '../../../services/stats.service'
import { PanelsEntityService } from '../../../services/ngrx-data/panels-entity/panels-entity.service'
import { PanelLinksEntityService } from '../../../services/ngrx-data/panel-links-entity/panel-links-entity.service'
import { DisconnectionPointsEntityService } from '../../../services/ngrx-data/disconnection-points-entity/disconnection-points-entity.service'
import { LinksPathService } from '../../../services/links/links-path.service'

export interface StringStatsModel {
  totals: TotalModel
  amountOfPanels: number
  amountOfLinks: number
  panelsNotInLink: number
  hasDisconnectionPoint: boolean
}

@Pipe({
  name: 'stringStatsAsync',
  standalone: true,
})
export class StringStatsAsyncPipe implements PipeTransform {
  constructor(
    private panelsEntity: PanelsEntityService,
    private linksEntity: PanelLinksEntityService,
    private statsService: StatsService,
    private disconnectionPointsEntity: DisconnectionPointsEntityService,
    private linksPathService: LinksPathService,
  ) {}

  transform(string: StringModel): Observable<StringStatsModel> {
    if (!string) {
      const stringStats: StringStatsModel = {
        amountOfPanels: 0,
        panelsNotInLink: 0,
        hasDisconnectionPoint: false,
        amountOfLinks: 0,
        totals: {
          totalImp: 0,
          totalIsc: 0,
          totalPmax: 0,
          totalVmp: 0,
          totalVoc: 0,
        },
      }
      return of(stringStats)
    }

    return this.panelsEntity.entities$
      .pipe(
        map((panels) => {
          return panels.filter((p) => p.stringId === string.id)
        }),
      )
      .pipe(
        switchMap((stringPanels) =>
          this.linksEntity.entities$
            .pipe(
              map((links) =>
                links.filter((l) => stringPanels.map((sps) => sps.id).includes(l.positiveToId!)),
              ),
            )
            .pipe(map((stringLinks) => ({ stringPanels, stringLinks })))
            .pipe(
              switchMap((res) =>
                this.disconnectionPointsEntity.entities$.pipe(
                  map((dps) => ({
                    stringPanels: res.stringPanels,
                    stringLinks: res.stringLinks,
                    hasDisconnectionPoint: !!dps.find((d) => d.stringId === string.id),
                  })),
                ),
              ),
            ),
        ),
      )
      .pipe(
        map((r) => {
          // this.linksPathService.orderPanelsInLinkOrder(string.id)
          const stringStats: StringStatsModel = {
            amountOfPanels: r.stringPanels.length,
            amountOfLinks: r.stringLinks.length,
            hasDisconnectionPoint: r.hasDisconnectionPoint,
            panelsNotInLink: r.stringLinks.length - r.stringPanels.length,
            totals: this.statsService.calculateStringTotals(string, r.stringPanels),
          }
          return stringStats
        }),
      )
  }
}

/*
const stringStats: StringStatsModel = {
  amountOfPanels: stringPanels.length,

}*/
