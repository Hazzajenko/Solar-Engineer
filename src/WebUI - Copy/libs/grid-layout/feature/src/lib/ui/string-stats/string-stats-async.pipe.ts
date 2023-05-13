import { inject, Pipe, PipeTransform } from '@angular/core'
import { GridPanelsStoreService, LinksStoreService, StatsService } from '@grid-layout/data-access'
import { GridStringModel, TotalModel } from '@shared/data-access/models'
import { Observable, of, switchMap } from 'rxjs'
import { map } from 'rxjs/operators'

export interface StringStatsModel {
  totals: TotalModel
  amountOfPanels: number
  amountOfLinks: number
  panelsNotInLink: number
}

@Pipe({
  name:       'stringStatsAsync',
  standalone: true,
})
export class StringStatsAsyncPipe
  implements PipeTransform {
  private statsService = inject(StatsService)
  private panelsStore = inject(GridPanelsStoreService)
  private linksStore = inject(LinksStoreService)

  transform(string: GridStringModel): Observable<StringStatsModel> {
    if (!string) {
      const stringStats: StringStatsModel = {
        amountOfPanels:  0,
        panelsNotInLink: 0,
        amountOfLinks:   0,
        totals:          {
          totalImp:  0,
          totalIsc:  0,
          totalPmax: 0,
          totalVmp:  0,
          totalVoc:  0,
        },
      }
      return of(stringStats)
    }

    return this.panelsStore.select
      .panelsByStringId$(string.id)
      .pipe(
        switchMap((stringPanels) =>
          this.linksStore.select
            .linksByPanels$(stringPanels)
            .pipe(map((stringLinks) => ({ stringPanels, stringLinks }))),
        ),
      )
      .pipe(
        map((r) => {
          const stringStats: StringStatsModel = {
            amountOfPanels:  r.stringPanels.length,
            amountOfLinks:   r.stringLinks.length,
            panelsNotInLink: r.stringLinks.length - r.stringPanels.length,
            totals:          this.statsService.calculateStringTotals(r.stringPanels),
          }
          return stringStats
        }),
      )
  }
}
